

function validateApiKey(req, res, next) {
    let api_key = req.headers['x-api-key'];
    console.log('Received API Key:', api_key);
    console.log('API Key from environment:', process.env.API_KEY);
    if (!api_key){
        console.error('API key is missing');
        res.status(401).send('API key is missing');
        return;
    } 
    if( api_key !== process.env.API_KEY) {
        console.error('Invalid API key');
        res.status(401).send('Invalid API key');
        return; 
    }

    console.log('API Key:', api_key);
    next();
}


module.exports = { validateApiKey}