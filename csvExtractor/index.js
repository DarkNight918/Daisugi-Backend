const mongoose = require("mongoose");
const csv = require('csv-parser');
const fs = require('fs');
const dotenv = require("dotenv");
const path = require("path");

// Define the path to your .env file
const envPath = path.join(__dirname, '../.env');

// Load the .env file
dotenv.config({ path: envPath });

const Schema = mongoose.Schema;
let schemaObj = {};
let DataModel;

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB successfully connected"));

fs.createReadStream('investors.csv')
  .pipe(csv())
  .on('headers', (headers) => {
    // Create mongoose schema dynamically from headers
    headers.forEach(header => {
      schemaObj[header] = String;
    });

    const DataSchema = new Schema(schemaObj);
    DataModel = mongoose.model('Data', DataSchema, 'investors');

    console.log(`Schema created: ${JSON.stringify(DataSchema)}`);
  })
  .on('data', (row) => {
    // create a new document
    const doc = new DataModel(row);
    doc.save()
    .then(() => {
      console.log(`Document inserted: ${JSON.stringify(doc)}`);
    })
    .catch((err) => {
      console.error(`Failed to insert document: ${err}`);
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });