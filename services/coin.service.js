const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const Coin = require("../models/coins");
const TopCoins = require("../models/coin_toplists");
const CoinGlobalChange = require("../models/coin_global_change")
const CoinInfluencers = require("../models/coin_influencers")

const Bottleneck = require("bottleneck");
const limiter = new Bottleneck({ maxConcurrent: 5, minTime: 100 });

const { Networks } = require("../data/data");

// LiveCoinWatch ------------------ get coin img, name, price, 1 hour 24 hours, 7 days, market cap and volume from LivecoinWatch

const getLiveCoinWatchData = () => {
  let intervalId;

  const config = {
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.LIVECOINWATCH_API_KEY,
    },
  };

  const fetchCoinData = async (offset) => {
    const data = {
      currency: "USD",
      sort: "rank",
      order: "ascending",
      offset: offset,
      limit: 100,
      meta: true,
    };

    try {
      let response = await axios.post(
        "https://api.livecoinwatch.com/coins/list",
        data,
        config
      );
      var coinData = [];

      for (const item of response.data) {
        // Check if the coin already exists in the database
        const existingCoin = await Coin.findOne({ name: item.name });

        if (existingCoin) {
          // Update the existing coin's information with the fetched data
          existingCoin.imgURL = item.png32;
          existingCoin.symbol = item.code;
          existingCoin.rank = item.rank || 0;
          existingCoin.price = item.rate || 0;
          existingCoin.hourlyChanged = item.delta.hour || 0;
          existingCoin.dailyChanged = item.delta.day || 0;
          existingCoin.weeklyChanged = item.delta.week || 0;
          existingCoin.monthlyChanged = item.delta.month || 0;
          existingCoin.quarterlyChanged = item.delta.quarter || 0;
          existingCoin.yearlyChanged = item.delta.year || 0;
          existingCoin.marketCap = item.cap || 0;
          existingCoin.volume = item.volume || 0;

          await existingCoin.save();
          coinData.push(existingCoin);
        } else {
          // Create a new coin documnet with the with the fetched data
          const newCoin = new Coin({
            rank: item.rank || 0,
            name: item.name,
            symbol: item.code,
            imgURL: item.png32,
            price: item.rate || 0,
            hourlyChanged: item.delta.hour || 0,
            dailyChanged: item.delta.day || 0,
            weeklyChanged: item.delta.week || 0,
            monthlyChanged: item.delta.month || 0,
            quarterlyChanged: item.delta.quarter || 0,
            yearlyChanged: item.delta.year || 0,
            marketCap: item.cap || 0,
            volume: item.volume || 0,
          });

          await newCoin.save();
        }
      }
    } catch (error) {
      console.log(error);
      clearInterval(intervalId);
    }
  };

  // Fetch data for each offset range
  const offsets = Array.from({ length: 20 }, (_, i) => i * 100);
  const fetchAllData = async () => {
    await Promise.all(offsets.map((offset) => fetchCoinData(offset)));

    // for (const offset of offsets) {
    //   await fetchCoinData(offset);
    // }

    console.log(
      "LiveCoinWatch ------- Coins data successfully finished! "
    );
  };

  fetchAllData();

  // Call fetchAllData every 5 minutes
  intervalId = setInterval(fetchAllData, 300000);
};

// IntotheBlock ------------------ update coin information from intotheblock API.

const callIntotheBlockAPI = async (symbols, dateRange) => {
  const config = {
    headers: {
      "X-Api-Key": process.env.INTOTHEBLOCK_API_KEY,
    },
  };

  // iterate every symbols
  for (const eachsymbol of symbols) {
    const url = `https://api.intotheblock.com/${eachsymbol.toLowerCase()}/financial?since=${
      dateRange.since
    }&until=${dateRange.until}`;

    const response = await axios.get(url, config);
    // Get the coin info from the response
    const { name, price, rank } = response.data;
    const inOutOfTheMoneyHistory = response.data.inOutOfTheMoneyHistory || [];
    const breakEvenPriceHistory = response.data.breakEvenPriceHistory || [];
    const volatility = response.data.volatility || [];
    const largeTxs = response.data.largeTxs || [];

    const existingCoin = await Coin.findOne({ name });

    const coin = {
      priceList: price || [],
      inOutOfTheMoneyHistory: inOutOfTheMoneyHistory || [],
      breakEvenPriceHistory: breakEvenPriceHistory || [],
      volatility: volatility || [],
      largeTxs: largeTxs || [],
    };

    // Check there is same Coin in the database or not
    if (existingCoin) {
      await Coin.findOneAndUpdate({ name }, coin);
      console.log(`IntotheBlock ------ ${name} is existing and updated`);
    }
    // else {
    //   await new Coin(coin).save();
    //   console.log(`IntotheBlock ------ ${coin.name} is new and updated`)
    // }
    // Delay for one second before calling the next API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

const updateIntotheBlockCoins = async () => {
  const dateRange = {
    since: "2023-03-07",
    until: "2023-03-08",
  };

  const coinData = fs.readFileSync(
    path.join(__dirname, "../data/intotheblock.json")
  );
  const coins = JSON.parse(coinData);

  const symbols = coins.map((coin) => {
    let symbol = coin.symbol;

    // Modify symbol if needed
    // if (symbol === "USDT") {
    //   symbol = "USD";
    // }

    return symbol;
  });

  await callIntotheBlockAPI(symbols, dateRange);
  console.log(
    "IntotheBlock ------- Successfuly Updated."
  );
};

// Update IntotheBlockCoins every 4 times in a day. Time is 1, 7, 13, 19 o'clock in GMT timezone.
const getIntheBlockCoinData = () => {
  cron.schedule(
    "0 1,7,13,19 * * *",
    () => {
      updateIntotheBlockCoins();
    },
    {
      scheduled: true,
      timezone: "Etc/GMT", // GMT timezone
    }
  );
};

// TokenInsight ----------- Get ATH Price, ATL Price, ATH Date, ATL Date, % from ATH, % to ATH

const updateTokenInsightCoins = async () => {
  const config = {
    headers: {
      TI_API_KEY: process.env.TI_API_KEY,
    },
  };

  try {
    const coins = await Coin.find({}, "name rank").sort("rank");
    const promises = coins.map(async (coin) => {
      const coinName = coin.name;
      const modifiedCoinName = coinName.replace(/ /g, "-");
      const apiEndPoint = `https://api.tokeninsight.com/api/v1/coins/${modifiedCoinName}`;

      // await new Promise(resolve => setTimeout(resolve, 100));

      try {
        await limiter.schedule(async () => {
          const response = await axios.get(apiEndPoint, config);
          const newTokenInsightData = response.data.data;
          // console.log(newTokenInsightData)
          const existingCoin = await Coin.findOne({ name: coinName });

          const coin = {
            name: coinName,
            rating: newTokenInsightData.rating,
            block_explorers: newTokenInsightData.block_explorers,
            platforms: newTokenInsightData.platforms,
            website: newTokenInsightData.website,
            community: newTokenInsightData.community,
            resource: newTokenInsightData.resource,
            code: newTokenInsightData.code,
            investors: newTokenInsightData.investors,
            localization: newTokenInsightData.localization,
            market_data: newTokenInsightData.market_data,
            tickers: newTokenInsightData.tickers,
          };

          if (existingCoin) {
            // Update the corresponding coin in the database with the new data
            await Coin.findOneAndUpdate({ name: coinName }, coin);
          }
          // Check if there is an existing coin in the database

          // else {
          //   // Add the new coin to the database
          //   await new Coin(coin).save((err, savedCoin) => {
          //     if (err) {
          //       console.log(`TokenInsight --------- Error adding ${coinName}: ${err}`)
          //     } else {
          //       console.log(`TokenInsight --------- ${coinName} is successfully added.`) 
          //     }
          //   })
          // }
        });
      } catch (err) {
        console.log(`TokenInsight --------- ${coinName} has No Data.`);
      }
    });

    await Promise.all(promises);
    console.log(
      "TokenInsight --------- Coin information is successfully updated! ----------"
    );
  } catch (err) {
    console.log(`TokenInsight --------- Updating coins error: ${err}`);
  }
};

// Defiend.fi ------------------ Get top coins of many chains.

const getTopCoinsData = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.DEFINEDFI_API_KEY, // Replace with your actual API key
    },
  };

  try {
    // Set the GraphQL endpoint URL
    const url = "https://api.defined.fi";

    const networkPromises = Networks.map(async (network) => {
      // Define the GraphQL query string
      const query = `
        {
          listTopTokens(limit: 5, networkFilter: ${network.id}, resolution: "1D") {
            address
            decimals
            exchanges {
              address
              id
              name
              iconUrl
              networkId
              tradeUrl
            }
            id
            liquidity
            name
            networkId
            price
            priceChange
            resolution
            symbol
            topPairId
            volume
          }
        }
      `;

      const response = await axios.post(url, { query }, config);
      return {
        networkName: network.name,
        data: response.data.data.listTopTokens,
      };
    });

    // Wait for all promises to complete
    const allResults = await Promise.all(networkPromises);

    // delete all datas before set the inforamtion in the database.
    await TopCoins.deleteMany();

    // Log the received data
    for (const result of allResults) {
      for (const tokenData of result.data) {
        const token = new TopCoins({
          ...tokenData,
          chain: result.networkName,
        });
        await token.save();
      }
    }
    console.log(`Defined.fi --------- Top Coins are successfully updated.`);
  } catch (err) {
    console.error(`Defined.fi --------- Updating Top Coins error: ${err}`);
  }
};

// Get Global Coin Change data by time ranges from lunar crush.
const getCoinGlobalChange = async () => {
  const lunarConfig = {
    headers: {
      "Authorization": 'Bearer ' + process.env.LUNARCRUSH_API_KEY,
    },
  };

  const intervals = ['1d', '1w', '1m', '3m', '6m', '1y', '2y', 'all'];
  const fields = ['oneday', 'oneweek', 'onemonth', 'threemonths', 'sixmonths', 'oneyear', 'twoyears', 'all'];

  try {
    for (let i = 0; i < intervals.length; i++) {
      try {
        const response = await axios.get(`https://lunarcrush.com/api3/coins/global/change?interval=${intervals[i]}`, lunarConfig);
        const data = response.data;
        
        // Save the data
        let update = {};
        update[fields[i]] = data;
        
        await CoinGlobalChange.findOneAndUpdate({}, update, { upsert: true });
        
      } catch (err) {
        console.error(`Error for interval ${intervals[i]}`);
      }
    }
    console.log(`Lunar crush --------- Coin Global Chnage data is updated.`);
  } catch (err) {
    console.error(`Lunar crush --------- updating coin global change error. ${err}`);
  }
}

// Get coin influencers from Lunar crush

const getCoinInfluencers = async () => {
  const lunarConfig = {
    headers: {
      "Authorization": 'Bearer ' + process.env.LUNARCRUSH_API_KEY,
    },
  };

  // Set the time ranges
  const intervals = ['1d', '1w', '1m', '3m', '6m', '1y', '2y', 'all'];
  const fields = ['oneday', 'oneweek', 'onemonth', 'threemonths', 'sixmonths', 'oneyear', 'twoyears', 'all'];

  try {
    for (let i = 0; i < intervals.length; i++) {
      try {
        const response = await axios.get(`https://lunarcrush.com/api3/coins/influencers?interval=${intervals[i]}`, lunarConfig);
        const data = response.data.data;
        
        // Save the data
        let update = {};
        update[fields[i]] = data;
        
        await CoinInfluencers.findOneAndUpdate({}, update, { upsert: true });
        
      } catch (err) {
        console.error(`Error for interval ${intervals[i]}`);
      }
    }
    console.log(`Lunar crush --------- Coin Influencers data is updated.`);
  } catch (err) {
    console.error(`Lunar crush --------- updating coin influencers error. ${err}`);
  }
}

module.exports = {
  getLiveCoinWatchData,
  updateIntotheBlockCoins,
  getIntheBlockCoinData,
  updateTokenInsightCoins,
  getTopCoinsData,
  getCoinGlobalChange,
  getCoinInfluencers,
};
