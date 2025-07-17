var crypto = require('crypto');

let api_key = null;
let api_keys = new Map();

function displayApiKeys() {
    if (api_keys.size === 0) {  
        console.log('No API keys available.');
        return;
    }
    console.log('Available API keys:'); 
    api_keys.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${value}`);    
    });
}

function createNewApiKey(email) {
    if (!email || !email.includes('@')) {
        console.error('Invalid email provided for API key creation');
        return null;
    }
    let newApiKey = crypto.randomBytes(16).toString('hex'); 
    api_keys.set (email, newApiKey);
    displayApiKeys();
    return newApiKey;   
}

function loadApiKey() {
    api_key = process.env.API_KEY;
    myArgV = process.argv[2];
    if (myArgV != null && myArgV.includes('--api-key=')) {
        api_key = myArgV.substring(myArgV.indexOf('=') + 1, myArgV.length);
    }
    if (api_key == null || api_key === '') {
      console.log("Api key not provided. Set the API_KEY env variable or api_key cmd line parameter.");
      process.exit(0);
      }
     api_keys.set('default', api_key);
     displayApiKeys(); 
    }

function validateApiKey(req, res, next) {
    let api_header_key = req.headers['x-api-key'];
    let email = req.query.email;
    let api_query_key = req.query.api_key;
    //console.log('Validating API key:', api_header_key, 'from email:', email, 'query key:', api_query_key);
    // Check if API key is provided in the header or query parameter
    // use query parameter if header first, then header
    if (api_query_key) {
        api_header_key = api_query_key;
    }
     if (!api_header_key){
      //  console.error('API key is missing');
        res.status(401).send('API key is missing');
        return;
    } 
    if (email && api_keys.has(email)) {
        api_key = api_keys.get(email);
    }
    else{
        api_key = api_keys.get('default');
    }
    //console.log('supplied API key:', api_key);
    //console.log('Checking against:', api_header_key);
    if( api_header_key !== api_key) {
        console.error('Invalid API key');
        res.status(401).send('Invalid API key');
        return; 
    }
    next();
}

loadApiKey()
module.exports = { validateApiKey, createNewApiKey}