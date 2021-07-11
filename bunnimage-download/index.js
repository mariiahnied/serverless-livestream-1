var fetch = require('node-fetch');

module.exports = async function (context, req) {
    var username = req.headers['username']; //username is the name of the blob fikle you wannt to download
    let blobStorage = "mh1"
    var download = "hi"
    var downloadpng = "https://" + blobStorage + ".blob.core.windows.net/images/" + username + ".png";
    var downloadjpg = "https://" + blobStorage + ".blob.core.windows.net/images/" + username + ".jpg";

    let pngresp = await fetch(downloadpng, {
        method: 'GET',
    })
    let pngdata = await pngresp;
    
    let jpgresp = await fetch(downloadjpg, {
    method: 'GET',
    })
    let jpgdata = await jpgresp;

    if (pngdata.statusText == "The specified blob does not exist." && jpgdata.statusText == "The specified blob does not exist." ) 
    {
        success = false; 
        context.log("Does not exist: " + pngdata)
        context.log("Does not exist: " + jpgdata)
    } 
    else if (pngdata.statusText != "The specified blob does not exist.") 
    {
        success = true;
        download = downloadpng
        context.log(download) //n
        context.log("Does exist: " + pngdata)
    } 
    else if (jpgdata.statusText != "The specified blob does not exist.") 
    {
        success = true;
        download = downloadjpg
        context.log(download) //
        context.log("Does exist: " + jpgdata)
    }

    context.res = {
        body: {
          "downloadUri" : download,
          "success": success,
        }
    };
    context.log(download);
    context.done();
};