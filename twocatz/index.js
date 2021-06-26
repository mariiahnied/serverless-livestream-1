const fetch = require('node-fetch')


function generate_name(){
    var names = ["Shreya", "Emily", "Fifi", "Beau", "Evelyn", "Julia", "Daniel", "Fardeen"]
    var random_value = Math.floor(names.length * Math.random());
    var resultname = names[random_value];
    return resultname

}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let endpoint =  "https://cataas.com/cat/cute/says/Bitcamp";

    let name1 = generate_name();
    let name2 = generate_name();
    
    let resp1 = await fetch(endpoint, {
        method: 'GET'
    });
    let data1 = await resp1.arrayBuffer()
    let base64data1 = Buffer.from(data1).toString('base64')

    let resp2 = await fetch(endpoint, {
        method: 'GET'
    });
    let data2 = await resp2.arrayBuffer()
    let base64data2 = Buffer.from(data2).toString('base64')
    
    context.res = {
        body: {
            cat1: base64data1,
            cat2: base64data2,
            names: [name1, name2]
        }
    };
}