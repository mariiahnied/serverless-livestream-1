const multipart = require('parse-multipart');
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


    let responseMessage = "";

    try{
        let password = req.headers['codename'];; // this will be the codename


        let boundary = multipart.getBoundary(req.headers['content-type']);
        let body = req.body;
        let parsedBody = multipart.Parse(body, boundary);

        let filetype = parsedBody[0].type;
        if (filetype == "image/png") {
            ext = "png";
        } else if (filetype == "image/jpeg") {
            ext = "jpeg";
        } else if (filetype == "image/jpg") {
            ext = "jpg"
        } else {
            username = "invalidimage"
            ext = "";
        }

        responseMessage = await uploadFile(parsedBody, ext, password);
    } catch(err){
        context.log("Undefined body image");
        responseMessage = "Sorry! No image attached.";
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

async function uploadFile(parsedBody, ext, password){
    // we want to access a specific container in azure, and we are giving our credentials
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString); //
    const containerName = "images";
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container

    const blobName = password + "." + ext;    // Create the container
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client

    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);

    return "Your file has been saved";
}
