const querystring = require('querystring');

module.exports = async function (context, req) {
    context.log(req.body)
    const queryObject = querystring.parse(req.body);


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: queryObject.MediaUrl0
        
    };
}
