const MongoClient = require('mongodb').MongoClient;
const dbName = 'custdb';
const url = 'mongodb://localhost:27017';
const collectionName = 'customers';
const connectionString = `${url}/${dbName}`;
let collection;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');
    const db = client.db(dbName);
    collection = db.collection(collectionName);
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

async function getCustomers() {
  try {
    if (!collection) {
      await connectToDatabase();
    }
    const customers = await collection.find({}).toArray();
    return [customers, null];
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    return [null, error.message];
  }
}

async function restCustomers() {
    let defaultCustomers = [{ "id": 0, "name": "Mary Jackson", "email": "maryj@abc.com", "password": "maryj" },
    { "id": 1, "name": "Karen Addams", "email": "karena@abc.com", "password": "karena" },
    { "id": 2, "name": "Scott Ramsey", "email": "scottr@abc.com", "password": "scottr" }];

    try {
        if (!collection) {  
            await connectToDatabase();
        }   
        await collection.deleteMany({});
        await collection.insertMany(defaultCustomers);  
        const customers = await collection.find({}).toArray();
        const message = "Data has been reset.  There are now " + customers.length + " customers in the database.";
        return [message, null];
    } catch (error) {
        console.error('Error resetting customers:', error.message);
        return [null, error.message];
    }
}


connectToDatabase();
module.exports = { getCustomers, restCustomers };