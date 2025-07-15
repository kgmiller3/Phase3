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

app.get('/resetCustomers', async (req, res) => {
    const [message, error] = await da.restCustomers();
    if(message) {
      res.send(message);
      return;
  } else {
    console.error('Error resetting customers:', error);
    res.status(500).send(error);
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