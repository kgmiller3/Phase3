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

async function getCustomerByFilter(filter) {
    try {
        if (!collection) {
            await connectToDatabase();
        }
        if (typeof filter !== 'object' || Object.keys(filter).length === 0) {
            return [null, 'Invalid filter provided'];
        }
        const customer = await collection.find(filter).toArray();
        if (!customer || customer.length === 0) {
            return [null, 'no matching customer documents found'];
        }
        return [customer, null];
    } catch (error) {
        return [null, error.message];
    }
}

async function restCustomers() {
    let defaultCustomers = [{ "id": "CUST001", "name": "Mary Jackson", "email": "maryj@abc.com", "password": "maryj" },
    { "id": "CUST002", "name": "Karen Addams", "email": "karena@abc.com", "password": "karena" },
    { "id": "CUST003", "name": "Scott Ramsey", "email": "scottr@abc.com", "password": "scottr" }];

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

async function incrementId() {
    // will only work until CUST999
  const cust = await collection.find().sort({"id":-1}).limit(1).toArray() ;
  id = cust[0].id; // Assuming id is a string like "CUST001"
  const prefix = id.slice(0, 4); // Get "CUST"
  let number = parseInt(id.slice(4)); // Get 1 (from "001")
  number++; // Increment to 2
  const newNumber =  String(number).padStart(3, '0'); // Pad with leading zeros: "002"
  newId = prefix + newNumber; // Combine to form "CUST002"
  return newId;
}


async function addCustomer(newCustomer) { 
    const dupCheck = await collection.findOne({ "email": newCustomer.email });
    if (dupCheck) {
        console.error('Customer with this email already exists:', newCustomer.email);
    
        return ["fail", null, 'Customer with this email already exists'];
    }   
    const newId = await incrementId();
    newCustomer["id"] = newId;
    try {
        if (!collection) {
            await connectToDatabase();
        }
        const result = await collection.insertOne(newCustomer);
        return ["success", result.insertedId, null];
    } catch (error) {
        console.error('Error adding customer:', error.message);
        return ["fail",null, error.message];
    }
}   

async function getCustomerById(id) {
    try {
        if (!collection) {
            await connectToDatabase();
        }
        const customer = await collection.findOne({ "id": id });
        
        if (!customer) {
            return [null, `Customer with ID ${id} not found`];
        }   
        return [customer, null];
    } catch (error) {
        console.error('Error fetching customer by ID:', error.message);
        return [null, error.message];
    }
}   

async function updateCustomer(updatedCustomer) {
    try {
        if (!collection) {
            await connectToDatabase();
        }
        const result = await collection.updateOne({ "id": updatedCustomer.id }, { $set: updatedCustomer });
        if (result.matchedCount === 0) {
            return [null, `Customer with ID ${updatedCustomer.id} not found`];
        }
        return [`success: updated customer ${updatedCustomer.id}`, null];
    } catch (error) {
        console.error('Error updating customer:', error.message);
        return [null, error.message];

    }
}

async function deleteCustomer(id) {
    try {
        if (!collection) {
            await connectToDatabase();
        }
        const result = await collection.deleteOne({ "id": id });
        if (result.deletedCount === 0) {    
            return [null, `No record deleted. Customer with ID ${id} not found`];
        }
        else {
            return [`success: deleted customer ${id}`, null];
        }   
    } catch (error) {
        console.error('Error deleting customer:', error.message);
        return [null, error.message];
    }
}


connectToDatabase();
module.exports = { getCustomers, restCustomers, addCustomer, getCustomerById,
     updateCustomer, deleteCustomer, getCustomerByFilter};