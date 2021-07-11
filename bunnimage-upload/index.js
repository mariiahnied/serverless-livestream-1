var multipart = require("parse-multipart")
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");


module.exports = async function (context, req) {
    var responseMessage = ""
    try{
        // get the header called "codename" which is how you want to name the file
        var password = req.headers['codename']; 

        // use parse-multipart to parse the body
        var body = req.body;
        var boundary = multipart.getBoundary(req.headers['content-type']);
        var parsedBody = multipart.Parse(body, boundary);
        
        // determine the file-type here!
        var filetype = parsedBody[0].type;
        
        if (filetype == "image/png") {
            ext = "png";
        } else if (filetype == "image/jpeg") {
            ext = "jpeg";
        } else if (filetype == "image/jpg") {
            ext = "jpg";
        } else {
            username = "invalidimage"
            ext = "";
        }
        responseMessage = await uploadFile(parsedBody, ext, password);
    }catch(err){
        context.log("Undefined body image");
        responseMessage = "Sorry! No image attached."
    }
    context.res = {
        body: responseMessage
    };
}

async function uploadFile(parsedBody, ext, password){ //"ext" for a  file extension
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = "images";
    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);    
    // Create the container
    const blobName = password + "." + ext;   
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); 

    const uploadBlobResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);

    return "Your blob is saved"
}