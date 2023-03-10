const axios = require('axios');
const Coin = require('../models/coin');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// get coin img, name, price, 1 hour 24 hours, 7 days, market cap and volume from LivecoinWatch

const getLiveCoin = (io) => {
  let intervalId;
  var lastCoinData = null;

  const config = {
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.LIVECOINWATCH_API_KEY,
    },
  };

  const data = {
    currency: "USD",
    sort: "rank",
    order: "ascending",
    offset: 0,
    limit: 50,
    meta: true,
  };

  const fetchCoinData = async () => {
    try {
      let response = await axios.post(
        "https://api.livecoinwatch.com/coins/list",
        data,
        config
      );
      var coinData = [];

      response.data.map((item) => {
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
          volume: item.volume,
        };

        coinData.push(tempInfo);
      });

      // Store the fetched coin data as the last coin data
      lastCoinData = coinData;

    } catch (error) {
      console.log(error);
      clearInterval(intervalId);
    }
  };

  fetchCoinData();

  // Get Coin information every 1 mintue
  intervalId = setInterval(fetchCoinData, 600000);

  // Save the last fetched data and emit it every second
  setInterval(() => {
    if (lastCoinData) {
      io.emit("totalCoinInfo", lastCoinData);
    }
  }, 1000);
};

// update coin information from intotheblock API.

const callIntotheBlockAPI = async (symbols, dateRange) => {
  
  // set the header
  const config = {
    headers: {
      "X-Api-Key": process.env.INTOTHEBLOCK_API_KEY,
    }
  }

  const coins = [];

  // iterate every symbols
  for (const eachsymbol of symbols) {

      const url = `https://api.intotheblock.com/${eachsymbol.toLowerCase()}/financial?since=${dateRange.since}&until=${dateRange.until}`;

      const response = await axios.get(url, config);
      // Get the coin info from the response
      const { name, symbol, price, rank } = response.data;
      const inOutOfTheMoneyHistory = response.data.inOutOfTheMoneyHistory || [];
      const breakEvenPriceHistory = response.data.breakEvenPriceHistory || [];
      const volatility = response.data.volatility || [];
      const largeTxs = response.data.largeTxs || [];

      const existingCoin = await Coin.findOne({ name })
      
      const coin = {
        name,
        symbol,
        price,
        rank,
        inOutOfTheMoneyHistory,
        breakEvenPriceHistory,
        volatility,
        largeTxs
      }

      // Check there is same Coin in the database or not
      if (existingCoin) {
        await Coin.findOneAndUpdate({ name }, coin);
        console.log(`${name} is updated`)
      } else {
        await new Coin(coin).save();
        console.log(`${coin.name} is updated`)
      }
      // Delay for one second before calling the next API
      await new Promise(resolve => setTimeout(resolve, 5000));
  }
}


const updateCoins = async () => {

  const dateRange = {
    since: '2023-03-07',
    until: '2023-03-08',
  }

  const coinData = fs.readFileSync(path.join(__dirname, '../data/intotheblock.json'));
  const coins = JSON.parse(coinData);
  
  const symbols = coins.map(coin => {
    let symbol = coin.symbol;

    // Modify symbol if needed
    // if (symbol === "USDT") {
    //   symbol = "USD";
    // }
    return symbol;
  })

  await callIntotheBlockAPI(symbols, dateRange);
  console.log('Coins updated Successfully!');
};

// Update Coins every 4 times in a day. Time is 1, 7, 13, 19 o'clock in GMT timezone.
const getIntheBlockCoinData = () => {
  cron.schedule('0 2,8,14,20 * * *', () => {
    updateCoins();
  }, {
    scheduled: true,
    timezone: 'Etc/GMT' // GMT timezone
  })
}

module.exports = {
  getLiveCoin,
  updateCoins,
  getIntheBlockCoinData,
}