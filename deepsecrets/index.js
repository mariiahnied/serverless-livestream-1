const querystring = require('querystring');
const CosmosClient = require("@azure/cosmos").CosmosClient;

const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseId: "SecretStorer",
    containerId: "secrets",
    partitionKey: {kind: "Hash", paths: ["/secrets"]}
  };

/*
// This script ensures that the database is setup and populated correctly
*/
async function create(client, databaseId, containerId) {
    const partitionKey = config.partitionKey;

    /**
     * Create the database if it does not exist
     */
    const { database } = await client.databases.createIfNotExists({
    id: databaseId
    });
    console.log(`Created database:\n${database.id}\n`);

    /**
     * Create the container if it does not exist
     */
    const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
        { id: containerId, partitionKey },
        { offerThroughput: 400 }
    );

    console.log(`Created container:\n${container.id}\n`);
}

async function createDocument(newItem){
    
    //connecting to the Azure Cosmos account
    const { endpoint, key, databaseId, containerId } = config;
    
    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseId);
    const container = database.container(containerId);
    
    // Make sure Tasks database is already setup. If not, create it.
    await create(client, databaseId, containerId);

    console.log(`Querying container: Items`);

    // query to return all items
    const querySpec = {
    query: "SELECT * from c"
    };

    // read all items in the Items container
    const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

    //delete?
    items.forEach(item => {
    console.log(`${item.id} - ${item.description}`);
    });

    /** Create new item
    * newItem is parameter that createDocument takes in
    */
    const { resource: createdItem } = await container.items.create(newItem);

    console.log(`\r\nCreated new item: ${createdItem.id} - ${createdItem.description}\r\n`);

    return items
}



module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const queryObject = querystring.parse(req.body);
    
    context.log(queryObject.Body)
    
    let message = queryObject.Body;
    let document = {
        "message" : message
    }

    let items = await createDocument(document);

    var random_value = Math.floor(items.length * Math.random());
    
    const responseMessage = `Thanks ????! Stored your secret "${message}". ???? Someone confessed that: ${JSON.stringify(items[random_value].message)}`
    
    context.res = {
        body: responseMessage
    };
}