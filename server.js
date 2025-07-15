const express = require('express');
const path = require('path');
const da = require("./data-access");


const app = express();
const port = process.env.PORT || 4000; 
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