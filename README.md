# Customer Database API

This project is a Node.js application that provides basic data access and authorization for a customer database using MongoDB.

## Features
- Connects to a local MongoDB instance
- Manages customer data in the `custdb` database, `customers` collection
- Includes basic authorization logic
- Serves a static HTML file from the `public` directory

## Project Structure
- `server.js`: Main server file
- `data-access.js`: Handles MongoDB connection and data operations
- `authorization.js`: Manages authorization logic
- `api_keys.json`: Stores API keys for authorization
- `public/index.html`: Static HTML page

## Setup
1. **Install dependencies:**
   ```pwsh
   npm install
   ```
2. **Start MongoDB:**
   Make sure MongoDB is running locally on `mongodb://localhost:27017`.
3. **Run the server:**
   ```pwsh
   node server.js
   ```

## Usage
- Access the app via `http://localhost:PORT` (default port is set in `server.js`).
- API endpoints and usage details can be found in the code comments.

## Requirements
- Node.js
- MongoDB

## License
MIT
