const axios = require("axios");
const DEXData = require("../models/exchanges_dexes");
const CEXData = require("../models/exchanges_cexes");
const TvlProtocolData = require("../models/protocols");
const Chain = require("../models/chains");
const PoolData = require("../models/pools");
const BridgeData = require("../models/bridges");
const cron = require("node-cron");

// DefiLlama ------------------ Get Data of each exchanges

const getDEXData = async () => {
  const apiDexUrl =
    "https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume";
  const apiFeeUrl =
    "https://api.llama.fi/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyFees";
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.get(apiDexUrl, config);
    const exchangeData = response.data.protocols;
    const totalExchangeInfo = response.data;

    // await DEXData.deleteMany()

    // Save the total exchange info

    // const totalExchangeData = new DEXData({
    //   ...totalExchangeInfo,
    //   name: 'TotalExchangeInfo',
    // });
    // await totalExchangeData.save();
    // console.log('DefiLlama --------- TotalExchangeInfo is successfully updated.');

    exchangeData.map(async (exchange) => {
      await DEXData.updateOne(
        { name: exchange.name },
        { $set: exchange },
        { upsert: true }
      );
    });

    // Get information for dailiyfees for dex
    const responseFee = await axios.get(apiFeeUrl, config);
    const feeData = responseFee.data.protocols;

    const updateDexPromises = feeData.map(async (data) => {
      const existingDex = await DEXData.findOne({ name: data.name });
      if (existingDex) {
        existingDex.parentProtocol = data.parentProtocol || "";
        existingDex.dailyRevenue = data.dailyRevenue || 0;
        existingDex.dailyUserFees = data.dailyUserFees || 0;
        existingDex.dailyHoldersRevenue = data.dailyHoldersRevenue || 0;
        existingDex.dailyCreatorRevenue = data.dailyCreatorRevenue || 0;
        existingDex.dailySupplySideRevenue = data.dailySupplySideRevenue || 0;
        existingDex.dailyProtocolRevenue = data.dailyProtocolRevenue || 0;
        existingDex.dailyFees = data.dailyFees || 0;

        await existingDex.save();
      }
    });

    // Wait for all promises to resolve
    await Promise.all(updateDexPromises);

    console.log('DefiLlama --------- DEX Information is successfully updated!');
  } catch (err) {
    console.error(`DefiLlama --------- Updating DEX Data error: ${err}`);
  }
};

// TokenInsight ------------------ GET CEX data

const getCEXData = async () => {
  const tokenInsightConfig = {
    headers: {
      TI_API_KEY: process.env.TI_API_KEY,
    },
  };

  const liveCoinConfig = {
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.LIVECOINWATCH_API_KEY,
    },
  };

  const tokenInsightURL = "https://api.tokeninsight.com/api/v1/exchanges/list?cex=true&dex=false&spot=true&derivatives=true";
  const liveCoinURL = "https://api.livecoinwatch.com/exchanges/single";

  try {
    const tokenInsightResponse = await axios.get(
      tokenInsightURL,
      tokenInsightConfig
    );
    const tokenInsightData = tokenInsightResponse.data.data;

    await CEXData.deleteMany();

    for (const data of tokenInsightData) {
      const eachCEXData = new CEXData(data);
      await eachCEXData.save();

      try {
        const requestData = {
          currency: "USD",
          code: data.exchange_name.toLowerCase().replace(".com", ""),
          meta: true,
        };

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
      } catch (err) {
        console.error(`LiveCoinWatch --------- Fetching data for ${eachCEXData.exchange_name} error: ${err}`);
      }
    }
    console.log("LiveCoinWatch --------- CEX Data is successfully updated.");
  } catch (err) {
    console.error(`TokenInsight --------- Updating CEX Data error: ${err}`);
  }
};

// DefiLlama ------------------ Get Protocol Data and Fee Data

const getTvlProtocolData = async () => {
  const apiUrl = "https://api.llama.fi/protocols";
  const apiFeeUrl = "https://api.llama.fi/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyFees";

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  try {
    const response = await axios.get(apiUrl, config);
    const feeResponse = await axios.get(apiFeeUrl, config);
    const tvlProtocolData = response.data;
    const feeData = feeResponse.data.protocols;

    const updatePromises = tvlProtocolData.map(async (tvlData) => {

      await TvlProtocolData.updateOne(
        { name: tvlData.name },
        { $set: tvlData },
        { upsert: true }
      );
      
    });

    Promise.all(updatePromises)

    // Get Fee data
    feeData.map(async (feedata) => {
      const existingTvl = await TvlProtocolData.findOne({ name: feedata.name })

      if (existingTvl) {
        await TvlProtocolData.updateOne(
          { name: feedata.name },
          { $set: feedata }
        );
      }
    })
    console.log("DefiLlama --------- TVL Fee Data is sucessfully updated.");
  } catch (err) {
    console.error(`DefiLlama --------- Updating TVL Data error: ${err}`);
  }
};

const getTvlChainData = async () => {
  const apiUrl = "https://api.llama.fi/chains";
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.get(apiUrl, config);
    const tvlChainData = response.data;

    tvlChainData.map(async (tvlData) => {
      // Set chainshortname to the value of tokenSymbol
      tvlData.chainShortName = tvlData.tokenSymbol;
      // const chain = await Chain.findOne({ chainFullName: tvlData.name });

      // if (chain) {
      //   chain.tvl = tvlData.tvl;
      //   chain.chainId = tvlData.chainId;
      //   await chain.save();
      //   console.log(
      //     `DefiLlama --------- TVL Chain Data ${tvlData.name} is successfully updated.`
      //   );
      // }

      await Chain.updateOne(
        { chainFullName: tvlData.name },
        { $set: tvlData },
        { upsert: true }
      );
    });
    console.log("DefiLlama --------- TVL Chain Data is sucessfully updated.");
  } catch (err) {
    console.error(`DefiLlama --------- Updating TVL Chain Data error: ${err}`);
  }
};

// DefiLlama ------------------ Get stable pools data

const getPoolsData = async () => {
  const apiUrl = "https://yields.llama.fi/pools";
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  await PoolData.deleteMany();

  try {
    const response = await axios.get(apiUrl, config);
    const poolData = response.data.data;

    poolData.map((data) => {
      const eachPoolData = new PoolData(data);
      eachPoolData.save();
    });

    console.log("DefiLlama --------- Pool Data is successfully finished! ----------");

  } catch (err) {
    console.error(`DefiLlama --------- Updating Pool Data error: ${err}`);
  }
};

// DefiLlama ------------------ Get stable bridges data

const getBridgeData = async () => {
  const apiUrl = "https://bridges.llama.fi/bridges?includeChains=true";
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  await BridgeData.deleteMany();

  try {
    const response = await axios.get(apiUrl, config);
    const bridgeData = response.data.bridges;
    bridgeData.map((data) => {
      const eachBridgeData = new BridgeData(data);
      eachBridgeData.save();
    });
    console.log("DefiLlama --------- Bridge Data is successfully finished! ----------");
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
  getBridgeData,
};
