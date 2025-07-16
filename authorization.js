let api_key = null;

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
    console.log('API Key loaded:', api_key);
    }

function validateApiKey(req, res, next) {
    let api_header_key = req.headers['x-api-key'];
    console.log('Received API Key from header:', api_header_key);
    if (!api_header_key){
        console.error('API key is missing');
        res.status(401).send('API key is missing');
        return;
    } 
    if( api_header_key !== api_key) {
        console.error('Invalid API key');
        res.status(401).send('Invalid API key');
        return; 
    }

    next();
}

loadApiKey()
module.exports = { validateApiKey}