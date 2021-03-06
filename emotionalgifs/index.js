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

    var result = await analyzeImage(imageData);

    let emotions = result[0].faceAttributes.emotion;
    let objects = Object.values(emotions); // What your array could look like: [0.01, 0.34, .....]
    const main_emotion = Object.keys(emotions).find(key => emotions[key] === Math.max(...objects));

    var gif = await findGifs(main_emotion);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body:gif.data.url
    };

    console.log(result)
    context.done(); 
}


async function analyzeImage(img){
    
    //change values while testing...
    const subscriptionKey = process.env.FACEAPI_KEY1; 
    const uriBase = process.env.FACEAPI_ENDPOINT + '/face/v1.0/detect';
    //...to hard values

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'
    })
    
    let resp = await fetch (uriBase + '?' + params.toString(), {
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

async function findGifs(emotion){
    const giphykey = process.env.GIF_KEY
    
    let gifresponse = await fetch("https://api.giphy.com/v1/gifs/translate?api_key=" + giphykey + "&s=" + emotion);
    const gifresp = await gifresponse.json();
    return gifresp;
}

