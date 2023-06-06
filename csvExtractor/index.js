const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

// Define the path to your .env file
const envPath = path.join(__dirname, "../.env");

// Load the .env file
dotenv.config({ path: envPath });

const Schema = mongoose.Schema;
let schemaObj = {};
let DataModel;

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB)
  .then(() => {
    
    console.log("DB successfully connected")

    fs.createReadStream("ventures.csv")
  .pipe(csv())
  .on("headers", (headers) => {
    // Create mongoose schema dynamically from headers
    headers.forEach((header) => {
      // Replace spaces with underscores and convert to lowercase
      let newHeader = header.replace(/ /g, "_").toLowerCase();
      schemaObj[newHeader] = String;
    });

    const DataSchema = new Schema(schemaObj);
    DataModel = mongoose.model("Data", DataSchema, "ventures");

    console.log(`Schema created: ${JSON.stringify(DataSchema)}`);
  })
  .on("data", (row) => {
    // Create a new object with modified keys to match the new schema
    let newRow = {};
    for (let key in row) {
      let newKey = key.replace(/ /g, "_").toLowerCase();
      newRow[newKey] = row[key];
    }

    // create a new document with the modified object
    const doc = new DataModel(newRow);
    doc
      .save()
      .then(() => {
        console.log(`Document inserted: ${JSON.stringify(doc)}`);
      })
      .catch((err) => {
        console.error(`Failed to insert document: ${err}`);
      });
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
});