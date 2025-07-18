const express = require('express');
const path = require('path');
const da = require("./data-access");
const bodyParser = require('body-parser');

const validateApiKey = require("./authorization").validateApiKey;
const createNewApiKey = require("./authorization").createNewApiKey;
const clearApiKeys = require("./authorization").clearApiKeys;



const app = express();
const port = process.env.PORT || 4000; 
app.use(bodyParser.json());
// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/customers', validateApiKey, async (req, res) => {
    const [customers, error] = await da.getCustomers();
    if(customers) {
      res.send(customers);
      return;
  } else {
    console.error('Error fetching customers:', error);
    res.status(500).send(error);
  }
});

app.get('/clearApiKeys', validateApiKey, (req, res) => {
    clearApiKeys();
    res.send('API keys cleared');
});


app.get('/apikey',  (req, res) => {
    let email = req.query.email;
    if (email) {
        const newApiKey = createNewApiKey(email);
        res.send({ newApiKey });
    }
    else {
        res.status(400).send('Email query parameter is required to create a new API key');
    }   
});

app.get('/reset', validateApiKey, async (req, res) => {
    const [message, error] = await da.restCustomers();
    if(message) {
      res.send(message);
      return;
  } else {
    console.error('Error resetting customers:', error);
    res.status(500).send(error);
  }
});

app.get('/customers/find', async (req, res) => {
    const filterParams = req.query;
    const filters = ["id", "name", "email"];
    if (!filterParams || Object.keys(filterParams).length === 0) {
        res.status(400).send('No filter provided');
        return;
    }
    const queryParamsKeys = Object.keys(req.query);
    if (queryParamsKeys.length === 0) {
        res.status(400).send('query string is required');
        return;
    }
    if (queryParamsKeys.length > 1) {
        res.status(400).send('Only one query parameter is allowed');    
        return;
    }
    let filter = queryParamsKeys[0];

    if (!filters.includes(filter)){
        res.status(400).send('Invalid filter parameter. Allowed parameters are: ' + filters.join(', '));
        return;
    }
    let mongoQuery = {};
    if (filter === 'id') {
        const id = parseInt(filterParams[filter]);
        if (isNaN(id)) {
            res.status(400).send('Invalid id provided');
            return;
        }
        mongoQuery[filter] = id;
    } else {
        if (!filterParams[filter] || filterParams[filter].trim() === '') {
            res.status(400).send(`Invalid ${filter} provided`);
            return;
        }  
        mongoQuery[filter] = filterParams[filter];
    }
    const [customer, error] = await da.getCustomerByFilter(mongoQuery);
    if (customer) {
        res.send(customer);
    } else {
        res.status(404).send(error);
    }
}
);



app.get('/customers/:id', validateApiKey, async (req, res) => {
    const id = req.params.id;
    const [customer, error] = await da.getCustomerById(id);
    if (customer) {
        res.send(customer);
    }
    else {
        console.error('Error fetching customer by ID:', error);
        res.status(404).send(error);
        return;
    }
   
});

app.post('/customers', validateApiKey, async (req, res) => {
    if (!req.body) {
        res.status(400).send('No customer data provided');
        return;
    }
    const newCustomer = req.body;
    if (!newCustomer || !newCustomer.name || !newCustomer.email || !newCustomer.password) {
        res.status(400).send('Invalid customer data');
        return;
    }
    
    const [status, id, error] = await da.addCustomer(newCustomer);
    if (status === "success") {
        newCustomer._id = id; // Assuming the ID is returned from the database
        res.status(201).send({ message: 'Customer added successfully',newCustomer });
    } else {
        console.error('Error adding customer:', error);
        res.status(400).send(error);
    }
});

app.put('/customers/:id', validateApiKey, async (req, res) => {
    
    const id = req.params.id;
    const updatedCustomer = req.body;
    if (!updatedCustomer) {
        res.status(400).send('No customer data provided');  
    }
    if (!updatedCustomer || !updatedCustomer.name || !updatedCustomer.email || !updatedCustomer.password) {
        res.status(400).send('Invalid customer data');
        return;
    }
    delete updatedCustomer._id ;
    try {
        const [message, error] = await da.updateCustomer(updatedCustomer);
        if (message) {
            res.send(message);
                } else {
                    console.error('Error updating customer:', error);
                    res.status(400).send(error);
                }
            } catch (err) {
                console.error('Exception updating customer:', err);
                res.status(500).send('Internal server error');
            }
        });

app.delete('/customers/:id', validateApiKey, async (req, res) => {
    const id = req.params.id;
    try {
        const [message, error] = await da.deleteCustomer(id);
        if (message) {
            res.send(message);
        } else {
            console.error('Error deleting customer:', error);
            res.status(400).send(error);
        }
    } catch (err) {
        console.error('Exception deleting customer:', err);
        res.status(500).send('Internal server error');
    }
        });

