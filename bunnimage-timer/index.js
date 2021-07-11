const { BlobServiceClient } = require("@azure/storage-blob"); //reference the @azure/storage-blob package
const connectionstring = process.env["AZURE_STORAGE_CONNECTION_STRING"];
const account = "mh1";

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionstring);
    const deletecontainer = "images";
    const deletecontainerClient = await blobServiceClient.getContainerClient(deletecontainer);

    for await (const blob of deletecontainerClient.listBlobsFlat()) {
        context.log('\t', blob.name);
        await deleteBlob(blob.name)
        // access the blob's name and call deleteBlob to delete it!
    }

    if (myTimer.isPastDue){
        context.log('Javascript is running late');
    }
    context.log('javaScript timer trigger function ran!', timeStamp);
};

async function deleteBlob(filename){
    //Create an instance of BlobServiceClient from connection string.
    const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionstring); 
    //Create a variable that references the name of the container that contains the file you want to delete.
    const deletecontainer = "images";
    //Fetch(go and get the container with that name)
    const deletecontainerClient = await blobServiceClient.getContainerClient(deletecontainer);
    //Within that container, fetch the block blob client that has the name of filename.
    const deleteblockBlobClient = deletecontainerClient.getBlockBlobClient(filename);
    //Download the blob from the system and fetch a reference to the readable stream.
    // 0 refers to the position of the blob to download
    const downloadBlockBlobResponse = await deleteblockBlobClient.download(0); 
    const blobDeleteResponse = deleteblockBlobClient.delete()
    
    result = {
        body : {
            deletename: filename,
            success: true
        }
    };
    return result;
    
}