const mongoose = require("mongoose");
const socket = require("socket.io");
const dotenv = require("dotenv");

const { getIntheBlockCoinData, getLiveCoin, updateCoins } = require("./services/coin.service")

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down.....");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const app = require("./app");

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => console.log("DB successfully connected"));

const port = process.env.PORT || 5000;

// Start the Server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  // Get started to call third party API for information
  getAllInfo();
});

const io = socket(server);

function getAllInfo() {
  getLiveCoin(io);
  // getIntheBlockCoinData();
  // updateCoins()
}

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down.....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});