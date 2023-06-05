const axios = require("axios");
const NFTMarketPlace = require("../models/nft_marketplaces");
const NFTTraders = require("../models/nft_traders");
const NFTTrendingData = require("../models/nft_trendings");
const NFTData = require("../models/nfts");
const DayTopNFT = require("../models/daytopnft");
const NFTGlobalData = require('../models/nft_global_data');
const NFTInfluencers = require("../models/nft_influencers");
const cron = require("node-cron");

const chainAPI = [
  { chainName: "ethereum", url: "https://restapi.nftscan.com" },
  { chainName: "bsc", url: "https://bnbapi.nftscan.com" },
  { chainName: "polygon", url: "https://polygonapi.nftscan.com" },
  { chainName: "arbitrum", url: "https://arbitrumapi.nftscan.com" },
  { chainName: "optimism", url: "https://optimismapi.nftscan.com" },
  { chainName: "avalanche", url: "https://avaxapi.nftscan.com" },
  { chainName: "cronos", url: "https://cronosapi.nftscan.com" },
  { chainName: "platon", url: "https://platonapi.nftscan.com" },
  { chainName: "moonbeam", url: "https://moonbeamapi.nftscan.com" },
  { chainName: "fantom", url: "https://fantomapi.nftscan.com" },
  { chainName: "gnosis", url: "https://gnosisapi.nftscan.com" },
];

const simpleHashChain = [
  "polygon",
  "arbitrum",
  "optimism",
  "avalanche",
  "gnosis",
  "bsc",
  "flow",
  "palm",
];

// NFT Scan ------------------ Get infos about NFT marketplaces.

const getNFTMarketPlaceData = async () => {
  let contract;

  const config = {
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.NFTSCAN_API_KEY,
    },
  };

  const changeAPI = [
    "/api/v2/statistics/ranking/marketplace?time=1d&sort_field=volume&sort_direction=desc",
    "/api/v2/statistics/ranking/marketplace?time=7d&sort_field=volume&sort_direction=desc",
    "/api/v2/statistics/ranking/marketplace?time=30d&sort_field=volume&sort_direction=desc",
  ];

  try {
    for (chain of chainAPI) {
      for (let i = 0; i < changeAPI.length; i++) {
        const apiURL = chain.url + changeAPI[i];
        let response = await axios.get(apiURL, config);

        switch (i) {
          case 0:
            contract = "contracts1d";
            gas = "gas1d";
            sales = "sales1d";
            wallets = "wallets1d";
            volume = "volume1d";
            break;
          case 1:
            contract = "contracts7d";
            gas = "gas7d";
            sales = "sales7d";
            wallets = "wallets7d";
            volume = "volume7d";
            break;
          case 2:
            contract = "contracts30d";
            gas = "gas30d";
            sales = "sales30d";
            wallets = "wallets30d";
            volume = "volume30d";
            break;
          default:
            contract = null;
            gas = null;
            sales = null;
            wallets = null;
            volume = null;
        }

        // Update the NFTMarketPlace collection with response
        for (const item of response.data.data) {
          const existingMarketPlace = await NFTMarketPlace.findOne({
            marketPlace: item.contract_name,
            chain: chain.chainName,
          });

          if (existingMarketPlace) {
            existingMarketPlace[contract] = item.contracts;
            existingMarketPlace[gas] = item.gas;
            existingMarketPlace[sales] = item.sales;
            existingMarketPlace[wallets] = item.wallets;
            existingMarketPlace[volume] = item.volume;

            existingMarketPlace.volume1d_change = parseFloat(
              item.volume1d_change.replace("%", "")
            );
            existingMarketPlace.volume7d_change = parseFloat(
              item.volume7d_change.replace("%", "")
            );
            existingMarketPlace.volume30d_change = parseFloat(
              item.volume30d_change.replace("%", "")
            );
            existingMarketPlace.fee = parseFloat(
              item.handling_fee.replace("%", "")
            );
            await existingMarketPlace.save();

            console.log(
              `NFTScan --------- ${item.contract_name} of ${chain.chainName} is existing and successfully updated.`
            );
          } else {
            const newMarketPlace = new NFTMarketPlace({
              marketPlace: item.contract_name,
              chain: chain.chainName,
              imgURL: item.logo_url,
              volume1d_change: parseFloat(
                item.volume1d_change.replace("%", "")
              ),
              volume7d_change: parseFloat(
                item.volume7d_change.replace("%", "")
              ),
              volume30d_change: parseFloat(
                item.volume30d_change.replace("%", "")
              ),
              fee: parseFloat(item.handling_fee.replace("%", "")),
            });

            // Set data for new marketplace
            newMarketPlace[contract] = item.contracts;
            newMarketPlace[gas] = item.gas;
            newMarketPlace[sales] = item.sales;
            newMarketPlace[wallets] = item.wallets;
            newMarketPlace[volume] = item.volume;

            await newMarketPlace.save();
          }
        }
      }
    }

    console.log("NFTScan --------- Marketplace Information is successfully updated.");
  } catch (err) {
    console.log(`NFTScan --------- Updating NFTMarketPace data error: ${err}`);
  }
};

// NFT Scan ------------------ Get infos about NFT traders.

const getNFTTradersData = async () => {
  const config = {
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.NFTSCAN_API_KEY,
    },
  };

  const buyChangeAPI = [
    {
      field: "buy1h",
      url: "/api/v2/statistics/ranking/traders?time=1h&trade_type=buy",
    },
    {
      field: "buy6h",
      url: "/api/v2/statistics/ranking/traders?time=6h&trade_type=buy",
    },
    {
      field: "buy12h",
      url: "/api/v2/statistics/ranking/traders?time=12h&trade_type=buy",
    },
    {
      field: "buy1d",
      url: "/api/v2/statistics/ranking/traders?time=1d&trade_type=buy",
    },
    {
      field: "buy3d",
      url: "/api/v2/statistics/ranking/traders?time=3d&trade_type=buy",
    },
    {
      field: "sell1h",
      url: "/api/v2/statistics/ranking/traders?time=3d&trade_type=sell",
    },
    {
      field: "sell6h",
      url: "/api/v2/statistics/ranking/traders?time=3d&trade_type=sell",
    },
    {
      field: "sell12h",
      url: "/api/v2/statistics/ranking/traders?time=3d&trade_type=sell",
    },
    {
      field: "sell1d",
      url: "/api/v2/statistics/ranking/traders?time=3d&trade_type=sell",
    },
    {
      field: "sell3d",
      url: "/api/v2/statistics/ranking/traders?time=3d&trade_type=sell",
    },
  ];

  try {
    // Get info for every chain
    for (chain of chainAPI) {
      for (i = 0; i < buyChangeAPI.length; i++) {
        // Get Result for each date. 1h, 6h, 12h, 1d, 3d
        let apiURL = chain.url + buyChangeAPI[i].url;
        try {
          let response = await axios.get(apiURL, config);

          // Initialize current field of chain info
          // await NFTTraders.updateMany(
          //   { chain: chain.chainName },
          //   {
          //     $set: { [buyChangeAPI[i].field]: { volume: 0, trades_total: 0 } },
          //   }
          // );

          await NFTTraders.deleteMany();

          for (const item of response.data.data) {
            // const existingTrader = await NFTTraders.findOne({
            //   account: item.account_address,
            //   chain: chain.chainName,
            // });

            // if (existingTrader) {
            //   existingTrader[buyChangeAPI[i].field] = {
            //     volume: item.volume,
            //     trades_total: item.trades_total,
            //   };

            //   await existingTrader.save();
            //   console.log(
            //     `NFTScan --------- NFT Trader ${item.account_address} of ${chain.chainName} is existing and Updated`
            //   );
            // } else {
            const newTrader = new NFTTraders({
              account: item.account_address,
              chain: chain.chainName,
            });

            newTrader[buyChangeAPI[i].field] = {
              volume: item.volume,
              trades_total: item.trades_total,
            };

            await newTrader.save();
            // }
          }
          console.log("NFTScan --------- NFT Trader Information is successfully updated!");
        } catch (err) {
          console.log(
            `NFTScan --------- Updating NFT Traders Buy data error ${apiURL} : ${err}`
          );
        }
      }
    }
    console.log(`NFTScan --------- Updating finished Successfully`);
  } catch (err) {
    console.log(
      `NFTScan --------- Updating NFT Traders Buy data error: ${err}`
    );
  }
};

// NFT Scan ------------------ Get infos about Top NFTs.

const getNFTTrendingdata = async () => {
  const config = {
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.NFTSCAN_API_KEY,
    },
  };

  const dataAPI = [
    "/api/v2/statistics/ranking/mint?time=1d",
    "/api/v2/statistics/ranking/trade?time=1d&sort_field=volume&sort_direction=desc&show_7d_trends=true",
    "/api/v2/statistics/ranking/gas?show_24h_trends=true",
  ];

  try {
    await NFTTrendingData.deleteMany();

    for (chain of chainAPI) {
      for (i = 0; i < dataAPI.length; i++) {
        // Get result for each API
        let apiURL = chain.url + dataAPI[i];
        try {
          let response = await axios.get(apiURL, config);

          // Add chainName to each item
          const updatedData = response.data.data.map((item) => ({
            ...item,
            chainName: chain.chainName,
          }));

          const updatePromises = updatedData.map((item) =>
            NFTTrendingData.updateOne(
              {
                contract_address: item.contract_address,
                chainName: chain.chainName,
              },
              { $set: item },
              { upsert: true }
            )
          );

          await Promise.all(updatePromises);

          // for (const item of response.data.data) {
          //   await NFTTrendingData.updateOne(
          //     { contract_address: item.contract_address },
          //     { $set: item },
          //     { upsert: true }
          //   );
          updatedData.forEach((item) =>
            console.log(
              `${item.contract_address} of ${chain.chainName} NFT Trending Information is successfully Updated`
            )
          );
          // }
        } catch (err) {
          console.log(
            `NFTScan --------- Updating Each NFT Trending Data error: ${err}`
          );
        }
      }
    }
    console.log(
      `NFTScan --------- Updating NFT Trending Data Successfully finished.`
    );
  } catch (err) {
    console.log(`NFTScan --------- Updating NFT Trending Data error: ${err}`);
  }
};

// SimpleHash ------------------ Get infos about NFTs

const getNFTData = async () => {
  const simpleHashConfig = {
    headers: {
      "x-api-key": process.env.SIMPLEHASH_API_KEY,
    },
  };

  const openCNFTConfig = {
    headers: {
      "x-api-key": process.env.OPENCNFT_API_KEY,
    },
  };

  // try {
  //   for (chain of simpleHashChain) {

  //       // check there is next collection or not
  //       let hasNext = true;
  //       let nextUrl = `https://api.simplehash.com/api/v0/nfts/collections/${chain}?limit=50`

  //       while (hasNext) {
  //         try {

  //           // Get NFT information for specific chain
  //           const response = await axios.get(nextUrl, simpleHashConfig);

  //           // Add chain Name to every data
  //           const updatedData = response.data.collections.map(item => ({
  //             ...item,
  //             chainName: chain,
  //           }));

  //           // Update the NFT Data. Create new if there isn't any and update if there is same thing
  //           const updatePromises = updatedData.map(item =>
  //             NFTData.updateOne(
  //               { collection_id: item.collection_id, chainName: chain },
  //               { $set: item },
  //               { upsert: true }
  //             )
  //           );

  //           await Promise.all(updatePromises)

  //           updatedData.forEach(item =>
  //             console.log(`${item.collection_id} of ${chain} NFT Information is successfully Updated`)
  //           )

  //           if (response.data.next) {
  //             nextUrl = response.data.next;
  //           } else {
  //             hasNext = false;
  //           }
  //         } catch (err) {
  //           console.log(`SimpleHash --------- Updating Each NFT Data error: ${err}`);
  //         }
  //       }
  //   }
  // } catch (err) {
  //   console.log(`SimpleHash --------- Updating NFT Data Data error: ${err}`);
  // }

  // Get Cardano NFT Information from

  // Structure the data for every response to save in collection
  const extractCardanoNFTData = (cardanoNFTData, time_range) => {
    return cardanoNFTData
      .map((item) => ({
        ...item,
        chainName: "cardano",
        one_day_change: item["1dChange"],
        seven_days_change: item["7dChange"],
        // img_url: item.thumbnail.replace('ipfs://', 'https://ipfs.io/ipfs/'),
        img_url: item.thumbnail,
        time_ranges: {
          [time_range]: {
            volume: item.volume,
            total_tx: item.total_tx,
            total_assets: item.total_assets,
          },
        },
      }))
      .map(({ "1dChange": _, "7dChange": __, ...rest }) => rest);
  };

  try {
    const cardarnoAPIUrl = [
      "https://api.opencnft.io/2/market/rank/collection?time_range=24h",
      "https://api.opencnft.io/2/market/rank/collection?time_range=7d",
      "https://api.opencnft.io/2/market/rank/collection?time_range=30d",
      "https://api.opencnft.io/2/market/rank/collection?time_range=all",
    ];

    // For time range. 24h, 7d, 30d, all.
    let timeRange = ["today", "week", "month", "all"];

    for (let i = 0; i < cardarnoAPIUrl.length; i++) {
      const response = await axios.get(cardarnoAPIUrl, openCNFTConfig);
      const cardanoNFTData = response.data.ranking;

      const updatedData = extractCardanoNFTData(cardanoNFTData, timeRange[i]);

      // Update the NFT Data. Create new if there isn't any and update if there is same thing
      const updatePromises = updatedData.map(async (item) => {
        const existingNFTData = await NFTData.findOne({
          name: item.name,
          chainName: "cardano",
        });

        // if it exists, add data to time_ranges
        if (existingNFTData) {
          const updatedTimeRanges = {
            ...existingNFTData.time_ranges,
            ...item.time_ranges,
          };

          return NFTData.updateOne(
            { name: item.name, chainName: "cardano" },
            { $set: { ...item, time_ranges: updatedTimeRanges } }
          );
        } else {
          return NFTData.updateOne(
            { name: item.name, chainName: "cardano" },
            { $set: item },
            { upsert: true }
          );
        }
      });

      await Promise.all(updatePromises);

      updatedData.forEach((item) =>
        console.log(
          `OpenCNFT --------- ${item.name} of Cardano NFT Information is successfully Updated`
        )
      );
    }
  } catch (err) {
    console.log(`OpenCNFT --------- Updating Cardano NFT Data error: ${err}`);
  }
};

// Get daily top NFT from lunar crush

const getDailyTopNFT = async () => {
  const lunarConfig = {
    headers: {
      "Authorization": 'Bearer ' + LUNARCRUSH_API_KEY,
    },
  };

  try {
    const response = await axios.get('https://lunarcrush.com/api3/nftoftheday', lunarConfig);
    const data = response.data;

    if (data.name && data.lunar_id) {
      // Create a new document with the response data and current date
      
      const dayTopNFT = new DayTopNFT({
        name: data.name,
        lunar_id: data.lunar_id,
        updated_date: new Date(),
      })

      await dayTopNFT.save()
      console.log("Lunar Crush --------- Daily Top NFT is successfully updated.")
    } else {
      console.log("Lunar Crush --------- Data from Lunarcrush to get DailyTopNFT is not correct.")
    }
  } catch (err) {
    console.error(`Lunar Crush --------- Updating Daily Top NFT error: ${err}`);
  }
}

// Get Global NFT data
const getGlobalNFTData = async () => {
  const lunarConfig = {
    headers: {
      "Authorization": 'Bearer ' + LUNARCRUSH_API_KEY,
    },
  };

  try {
    const response = await axios.get('https://lunarcrush.com/api3/nftoftheday', lunarConfig);
    const data = response.data;

    await NFTGlobalData.findOneAndUpdate({}, { data }, { upsert: true });
    console.log("Global NFT data updated successfully.");

  } catch (err) {

  }
}

// Get nft influencers from Lunar crush

const getNFTInfluencers = async () => {
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
        const response = await axios.get(`https://lunarcrush.com/api3/nfts/influencers?interval=${intervals[i]}`, lunarConfig);
        const data = response.data.data;
        
        // Save the data
        let update = {};
        update[fields[i]] = data;
        
        await NFTInfluencers.findOneAndUpdate({}, update, { upsert: true });
        
      } catch (err) {
        console.error(`Error for interval ${intervals[i]}`);
      }
    }
    console.log(`Lunar crush --------- NFT Influencers data is updated.`);
  } catch (err) {
    console.error(`Lunar crush --------- updating NFT influencers error. ${err}`);
  }
}

module.exports = {
  getNFTMarketPlaceData,
  getNFTTradersData,
  getNFTTrendingdata,
  getNFTData,
  getDailyTopNFT,
  getNFTInfluencers,
};
