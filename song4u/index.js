const querystring = require('querystring');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log(req.body) //? user message number meassge is saved as req.body

    const queryObject = querystring.parse(req.body);
    const url = queryObject.MediaUrl0;

    //downloading the image from url
    let resp = await fetch(url,{   
        method: 'GET',
    })
    //data holds th eiimage we just downloaded
    let data = await resp.arrayBuffer() // we are receiving it as a Buffer since this is binary data
    
    let result = await analyzeImage(data);  

    let age = result[0].faceAttributes.age
    let generation = determine_generation(age)

    context.log(generation)
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: generation
    };
}

function determine_generation(age){
    let id;
    
    if (age > 5 && age < 25) {
        id = "GenZ"
    }
    else if (age > 24 && age < 41) {
        id = "GenY"
    }
    else if (age > 40 && age < 57) {
        id = "GenX"
    }
    else if (age > 56 && age < 76) {
        id = "BabyBoomers"
    }
    else {
        id = "Unknown"
    }
    return id;
}

async function analyzeImage(img){
    const subscriptionKey = process.env.FACEAPI_KEY1; 
    const uriBase = process.env.FACEAPI_ENDPOINT + '/face/v1.0/detect';

    let params = new URLSearchParams({
	'returnFaceId': 'true',
	'returnFaceAttributes': 'age'
    })
    // making the post request
    let resp = await fetch(uriBase + '?' + params.toString(),{
        method: 'POST',
        body: img,
        // img is the parameter inputted
        headers: {
            'Content-Type' : 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    })
    // receive the response
    let data = await resp.json();
    return data;
}
