const axios = require("axios");
const NFTMarketPlace = require("../models/nft_marketplaces");
const NFTTraders = require("../models/nft_traders");
const cron = require("node-cron");

const chainAPI = [
  { chainName: "ethereum", url: "https://restapi.nftscan.com" },
  { chainName: "bnb", url: "https://bnbapi.nftscan.com" },
  { chainName: "polygon", url: "https://polygonapi.nftscan.com" },
  { chainName: "arbitrum", url: "https://arbitrumapi.nftscan.com" },
  { chainName: "optimism", url: "https://optimismapi.nftscan.com" },
  { chainName: "avax", url: "https://avaxapi.nftscan.com" },
  { chainName: "cronos", url: "https://cronosapi.nftscan.com" },
  { chainName: "platon", url: "https://platonapi.nftscan.com" },
  { chainName: "moonbeam", url: "https://moonbeamapi.nftscan.com" },
  { chainName: "fantom", url: "https://fantomapi.nftscan.com" },
  { chainName: "gnosis", url: "https://gnosisapi.nftscan.com" },
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
            console.log(
              `NFTScan --------- ${item.contract_name} of ${chain.chainName} is new and successfully updated.`
            );
          }
        }
      }
    }

    console.log(
      "---------- Getting NFTScan Marketplace Information is successfully finished! ----------"
    );
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

          await NFTTraders.deleteMany()

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
              console.log(
                `NFTScan --------- NFT Trader ${item.account_address} of ${chain.chainName} is new and Updated`
              );
            // }
          }
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

module.exports = {
  getNFTMarketPlaceData,
  getNFTTradersData,
};
