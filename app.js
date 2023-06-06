const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const path = require("path");

const coinRouter = require("./routes/coin");
const exchangeRouter = require("./routes/exchanges");
const defiRouter = require("./routes/defi");
const newsRouter = require("./routes/news");
const nftRouter = require("./routes/nft")
const funcRouter = require("./routes/func")

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
  // res.json({ message: "Server is running!" });
});

// Routes
app.use("/api/coin", coinRouter);
app.use("/api/exchange", exchangeRouter);
app.use("/api/defi", defiRouter);
app.use("/api/news", newsRouter);
app.use("/api/nft", nftRouter);
app.use("/api/func", funcRouter);

// Add wildcard route for all other URLs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

module.exports = app;
