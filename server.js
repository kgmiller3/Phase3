const express = require('express');
const path = require('path');
const da = require("./data-access");
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 4000; 
app.use(bodyParser.json());
// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/customers', async (req, res) => {
    const [customers, error] = await da.getCustomers();
    if(customers) {
      res.send(customers);
      return;
  } else {
    console.error('Error fetching customers:', error);
    res.status(500).send(error);
  }
});

app.get('/reset', async (req, res) => {
    const [message, error] = await da.restCustomers();
    if(message) {
      res.send(message);
      return;
  } else {
    console.error('Error resetting customers:', error);
    res.status(500).send(error);
  }
});

app.get('/customers/:id', async (req, res) => {
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

app.post('/customers', async (req, res) => {
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
        res.status(400).send(error.message);
    }
});

app.put('/customers/:id', async (req, res) => {
    
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