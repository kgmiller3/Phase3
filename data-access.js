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


connectToDatabase();
module.exports = { getCustomers};