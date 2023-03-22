const axios = require('axios');
const ExchangeData = require('../models/exchanges_dexes')
const CEXData = require('../models/exchanges_cexes')
const TvlProtocolData = require('../models/tvl_protocols')
const TvlChainData = require('../models/tvl_chains')
const PoolData = require('../models/pools')
const BridgeData = require('../models/bridges')
const cron = require("node-cron");

// DefiLlama ------------------ Get Data of each exchanges

const getDEXData = async () => {
  const apiDexUrl = 'https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume';
  const apiFeeUrl = 'https://api.llama.fi/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyFees'
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.get(apiDexUrl, config);
    const exchangeData = response.data.protocols;
    // const totalExchangeInfo = response.data;

    await ExchangeData.deleteMany()

    // Save the total exchange info

    // const totalExchangeData = new ExchangeData({
    //   ...totalExchangeInfo,
    //   name: 'TotalExchangeInfo',
    // });
    // await totalExchangeData.save();
    // console.log('DefiLlama --------- TotalExchangeInfo is successfully updated.');

    exchangeData.map(exchange => {
      const exchangeData = new ExchangeData(exchange)
      exchangeData.save();
      console.log(`DefiLlama --------- DEX Data ${exchange.name} sucessfully updated.`)
    })

    // Get information for dailiyfees for dex
    const responseFee = await axios.get(apiFeeUrl, config);
    const feeData = responseFee.data.protocols;

    const updateDexPromises = feeData.map(async (data) => {
      const existingDex = await ExchangeData.findOne({ name: data.name });
      if (existingDex) {
        existingDex.parentProtocol = data.parentProtocol || '';
        existingDex.dailyRevenue = data.dailyRevenue || 0;
        existingDex.dailyUserFees = data.dailyUserFees || 0;
        existingDex.dailyHoldersRevenue = data.dailyHoldersRevenue || 0;
        existingDex.dailyCreatorRevenue = data.dailyCreatorRevenue || 0;
        existingDex.dailySupplySideRevenue = data.dailySupplySideRevenue || 0;
        existingDex.dailyProtocolRevenue = data.dailyProtocolRevenue || 0;
        existingDex.dailyFees = data.dailyFees || 0;

        await existingDex.save();
        console.log(`DefiLlama --------- DEX Fee Data for ${data.name} successfully updated.`);
      }
    })

    // Wait for all promises to resolve
    await Promise.all(updateDexPromises);
    
    console.log(`---------- Getting DefiLlama DEX Information is successfully finished! ----------`);
  } catch (err) {
    console.error(`DefiLlama --------- Updating DEX Data error: ${err}`);
  }
};

// TokenInsight ------------------ GET CEX data

const getCEXData = async () => {

  const tokenInsightConfig = {
    headers: {
      "TI_API_KEY": process.env.TI_API_KEY,
    }
  }

  const liveCoinConfig = {
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.LIVECOINWATCH_API_KEY,
    },
  };

  const tokenInsightURL = 'https://api.tokeninsight.com/api/v1/exchanges/list?cex=true&dex=false&spot=true&derivatives=true'
  const liveCoinURL = 'https://api.livecoinwatch.com/exchanges/single'

  try {
    const tokenInsightResponse = await axios.get(tokenInsightURL, tokenInsightConfig)
    const tokenInsightData = tokenInsightResponse.data.data;

    await CEXData.deleteMany()

    for (const data of tokenInsightData) {
      const eachCEXData = new CEXData(data);
      await eachCEXData.save();
      console.log(`TokenInsight --------- CEX Data ${eachCEXData.exchange_name} sucessfully updated.`)

      try {
        const requestData = {
          currency: "USD",
          code: data.exchange_name.toLowerCase().replace('.com', ''),
          meta: true
        }

        let liveCoinResponse = await axios.post(
          liveCoinURL,
          requestData,
          liveCoinConfig
        );
        const liveCoinData = liveCoinResponse.data;
        
        eachCEXData.imgURL = liveCoinData.png64 || "";
        eachCEXData.volume = liveCoinData.volume || 0;
        eachCEXData.bidTotal = liveCoinData.bidTotal || 0;
        eachCEXData.askTotal = liveCoinData.askTotal || 0;
        eachCEXData.depth = liveCoinData.depth || 0;
        eachCEXData.visitors = liveCoinData.visitors || 0;
        eachCEXData.volumePerVisitor = liveCoinData.volumePerVisitor || 0;
        
        // Save the updated eachTokenData
        await eachCEXData.save();
        console.log(`LiveCoinWatch --------- CEX Data ${eachCEXData.exchange_name} successfully updated.`);
        
      } catch (err) {
        console.error(`LiveCoinWatch --------- Fetching data for ${eachCEXData.exchange_name} error: ${err}`);
      }
    }
  } catch (err) {
    console.error(`TokenInsight --------- Updating CEX Data error: ${err}`);
  }

  
}

// DefiLlama ------------------ Get Data of tvls

const getTvlProtocolData = async () => {
  const apiUrl = 'https://api.llama.fi/protocols';
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await TvlProtocolData.deleteMany()

  try {
    const response = await axios.get(apiUrl, config);
    const tvlProtocolData = response.data;

    tvlProtocolData.map(tvlData => {
      const tvlProtocolData = new TvlProtocolData(tvlData)
      tvlProtocolData.save();

      console.log(`DefiLlama --------- TVL Data ${tvlData.name} is sucessfully updated.`)
    })
    console.log(`---------- Getting DefiLlama Information is successfully finished! ----------`);
  } catch (err) {
    console.error(`DefiLlama --------- Updating TVL Data error: ${err}`);
  }
};

const getTvlChainData = async () => {
  const apiUrl = 'https://api.llama.fi/chains';
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await TvlChainData.deleteMany()

  try {
    const response = await axios.get(apiUrl, config);
    const tvlChainData = response.data;

    tvlChainData.map(tvlData => {
      const tvlChainData = new TvlChainData(tvlData)
      tvlChainData.save();

      console.log(`DefiLlama --------- TVL Chain Data ${tvlData.name} is sucessfully updated.`)
    })
    console.log(`---------- Getting DefiLlama Information is successfully finished! ----------`);
  } catch (err) {
    console.error(`DefiLlama --------- Updating TVL Chain Data error: ${err}`);
  }
};

// DefiLlama ------------------ Get stable pools data

const getPoolsData = async () => {
  const apiUrl = 'https://yields.llama.fi/pools';
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await PoolData.deleteMany()

  try {
    const response = await axios.get(apiUrl, config);
    const poolData = response.data.data;

    poolData.map(data => {
      const eachPoolData = new PoolData(data)
      eachPoolData.save();

      console.log(`DefiLlama --------- Pool Data ${eachPoolData.project} is sucessfully updated.`)
    })
    console.log(`---------- Getting DefiLlama Information is successfully finished! ----------`);
  } catch (err) {
    console.error(`DefiLlama --------- Updating Pool Data error: ${err}`);
  }
};

// DefiLlama ------------------ Get stable bridges data

const getBridgeData = async () => {
  const apiUrl = 'https://bridges.llama.fi/bridges?includeChains=true';
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  await BridgeData.deleteMany()

  try {
    const response = await axios.get(apiUrl, config);
    const bridgeData = response.data.bridges;
    bridgeData.map(data => {
      const eachBridgeData = new BridgeData(data)
      eachBridgeData.save();

      console.log(`DefiLlama --------- Bridge Data ${eachBridgeData.name} is sucessfully updated.`)
    })
    console.log(`---------- Getting DefiLlama Information is successfully finished! ----------`);
  } catch (err) {
    console.error(`DefiLlama --------- Updating Bridge Data error: ${err}`);
  }
};

module.exports = {
  getDEXData,
  getCEXData,
  getTvlProtocolData,
  getTvlChainData,
  getPoolsData,
  getBridgeData
}