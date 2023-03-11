const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const path = require("path");

const coinRouter = require("./routes/coin");

// Start Express
const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// Data sanitization aaginst NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

app.use(async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(path.join(__dirname, "client")));

// Define a route for the root URL that sends an HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Routes
app.use("/api/coin", coinRouter);

// Add wildcard route for all other URLs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

module.exports = app;
