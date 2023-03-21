const axios = require('axios');
const ExchangeData = require('../models/exchanges')
const TvlProtocolData = require('../models/tvl_protocol')
const TvlChainData = require('../models/tvl_chain')
const cron = require("node-cron");

// DefiLlama ------------------ Get Data of each exchanges

const getExchangesData = async () => {
  const apiUrl = 'https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume';
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.get(apiUrl, config);
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
      console.log(`DefiLlama --------- Exchange Data ${exchange.name} sucessfully updated.`)
    })
    console.log(`---------- Getting DefiLlama Information is successfully finished! ----------`);
  } catch (err) {
    console.error(`DefiLlama --------- Updating Exchanges error: ${err}`);
  }
};

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

module.exports = {
  getExchangesData,
  getTvlProtocolData,
  getTvlChainData
}