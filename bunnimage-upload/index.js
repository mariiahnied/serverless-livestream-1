const fetch = require("node-fetch")
const multipart = require("parse-multipart")
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const {BlobServiceClient} = require("@azure/storage-blob");

async function uploadFile(parsedBody, ext, password) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    const containerName = "images";

    const containerClient = blobServiceClient.getContainerClient(containerName);
    // Get a reference to a container

    const blobName = password + "." + ext;
    // Create the container

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // Get a block blob client

    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
    // upload data to blob

    return ("Your blob is saved!");
};

module.exports = async function (context, req) {

    let responseMessage = ""
    try{
        // get the header called "codename" which is how you want to name the file
        var password = req.headers['codename']; 

        // use parse-multipart to parse the body
        let body = req.body;
        let boundary = multipart.getBoundary(req.headers['content-type']);
        let parsedBody = multipart.Parse(body, boundary);
        
        // determine the file-type here!
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
    } catch (err) {
        context.log("Undefined body image");
        responseMessage = "Sorry! No image attached."
    }

    context.res = {
        body: responseMessage
    };
    context.done();
}