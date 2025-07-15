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
  try {
    const customers = await da.getCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).send('Internal Server Error');
  }
});