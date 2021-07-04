var multipart = require('parse-multipart');
var fetch = require('node-fetch');

module.exports = async function (context, req) {
    // here's your boundary:
    var boundary = multipart.getBoundary(req.headers['content-type']);
    
    // TODO: assign the body variable the correct value
    var body = req.body

    // parse the body
    var parts = multipart.Parse(body, boundary);
  
    // do not need it anymore
    //var convertedResult = Buffer.from(parts[0].data).toString('base64');
    var imageData = parts[0].data;

    
    //module.exports function
    //analyze the image
    var result = await analyzeImage(imageData);
    context.res = {
        body: {
            result
        }
    };
    console.log(result)
    context.done(); 


}


async function analyzeImage(img){
    
    //change values while testing...
    //const subscriptionKey = process.env.FACEAPI_KEY1; 
    //const uriBase = process.env.FACEAPI_ENDPOINT + '/face/v1.0/detect';
    
    //...to this
    const subscriptionKey = "cd78cabb10ff4efdb04cc2da471d6444";
    const uriBase = "https://gettingemotional2.cognitiveservices.azure.com/face/v1.0/detect";


    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'
    })
    
    let resp = await fetch(uriBase + '?' + params.toString(), {
        method: 'POST',  //WHAT TYPE OF REQUEST?
        body: img,  //WHAT ARE WE SENDING TO THE API?
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    })
    let data = await resp.json();
    
    return data; 
}
