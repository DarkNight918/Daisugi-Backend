const mongoose = require("mongoose");
// const socket = require("socket.io");
const dotenv = require("dotenv");

const {
  getIntheBlockCoinData,
  getLiveCoinWatchData,
  updateIntotheBlockCoins,
  updateTokenInsightCoins,
  getTopCoinsData,
  getCoinInfluencers,
} = require("./services/coin.service");

const {
  getNFTMarketPlaceData,
  getNFTTradersData,
  getNFTTrendingdata,
  getNFTData,
  getNFTInfluencers,
} = require("./services/nft.service");

const {
  getDEXData,
  getCEXData,
  getTvlProtocolData,
  getTvlChainData,
  getPoolsData,
  getBridgeData
} = require("./services/exchange.service");

const {
  getChainData,
} = require("./services/chains.service");

const {
  getRichAddressData,
} = require("./services/address.service");

const publishAllInfo = require("./services/publish.service");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down.....");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const app = require("./app");

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

// const io = socket(server);

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//   },
// });

// Initialize socket.io server
// io.on("connection", (socket) => {
//  console.log(`user just connected`, socket.id);
// publishAllInfo(socket);

//  socket.on("NextCoinInfo", data => {
//    publishAllInfo(socket, data)
//  })

//  socket.on("disconnect", () => {
//    console.log("🔥: A user disconnected.");
//  });
// });

function getAllInfo() {
  // getLiveCoinWatchData();
  // updateTokenInsightCoins();
  // getIntheBlockCoinData();
  // updateIntotheBlockCoins();
  // getNFTMarketPlaceData();
  // getNFTTradersData();
  // getNFTInfluencers();
  // getTopCoinsData();
  // getCoinInfluencers();
  // getDEXData();
  // getCEXData();
  // getTvlProtocolData();
  // getTvlChainData();
  // getPoolsData();
  // getBridgeData();
  // getChainData();
  // getRichAddressData();
  // getNFTTrendingdata();
  // getNFTData();
}

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down.....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
