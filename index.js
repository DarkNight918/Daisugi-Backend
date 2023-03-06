const express = require('express')
const axios = require('axios')
const socket = require('socket.io')
const cors = require('cors')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 8000

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(cors())

// Start the server and Socket.IO
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  startBackend();
});

const io = socket(server);

// Define function to call LiveCoinWatch API every 5 seconds and emit response
function callLiveCoinWatchAPI() {

  const config = {
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.LIVECOINWATCH_API_KEY,
    }
  }

  const data = {
    currency: "USD",
    sort: "rank",
    order: "ascending",
    offset: 0,
    limit: 2,
    meta: true
  }

  let intervalId;
  let lastCoinData = null;

  const fetchCoinData = async () => {
    console.log(process.env.LIVECOINWATCH_API_KEY)
    try {
      let response = await axios.post('https://api.livecoinwatch.com/coins/list', data, config);
      var coinData = [];

      response.data.map(item => {
        // Make coinData information to send to frontend.
        let tempInfo = {
          id: item.rank,
          imgURL: item.png32,
          name: item.name,
          price: item.rate,
          hourlyChanged: item.delta.hour,
          dailyChanged: item.delta.day,
          weeklyChanged: item.delta.week,
          marketCap: item.cap,
          volume: item.volume
        }

        coinData.push(tempInfo);
      })

      // Store the fetched coin data as the last coin data
      lastCoinData = coinData;

      // Emit information
      io.emit('totalCoinInfo', coinData);
      console.log(coinData);
    } catch (error) {
      console.log(error);
      clearInterval(intervalId);
    }
  }

  fetchCoinData();
  intervalId = setInterval(fetchCoinData, 10000);

  // Save the last fetched data and emit it every second
  setInterval(() => {
    if (lastCoinData) {
      io.emit('totalCoinInfo', lastCoinData);
    }
  }, 1000);
}

function startBackend() {
  callLiveCoinWatchAPI();
}