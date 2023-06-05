const axios = require('axios')
const NFTInfluencers = require("../models/nft_influencers");

exports.getNFTInfluencers = async (req, res) => {
  try {
    // Validate that the interval was provided and is one of the expected values
    const validIntervals = ['1d', '1w', '1m', '3m', '6m', '1y', '2y', 'all'];
    const interval = req.query.interval;
    
    if (!interval || !validIntervals.includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval' });
    }

    // Map the interval to the corresponding field in the database document
    const intervalFieldMap = {
      '1d': 'oneday',
      '1w': 'oneweek',
      '1m': 'onemonth',
      '3m': 'threemonths',
      '6m': 'sixmonths',
      '1y': 'oneyear',
      '2y': 'twoyears',
      'all': 'all'
    };

    const influencers = await NFTInfluencers.findOne();
    if (!influencers) {
      return res.status(404).json({ error: 'No data found' });
    }
    
    const data = influencers[intervalFieldMap[interval]]
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// get NFTMarketplace data
exports.getNFTMarketplace = async (req, res) => {

  const config = {
    headers: {
      "X-API-KEY": process.env.NFTSCAN_API_KEY,
    },
  };

  try {

    const timeRange = req.query.timeRange;

    if (!timeRange) {
      res.status(400).json({ error: "No Time Range" })
    }

    const response = await axios.get(`https://restapi.nftscan.com/api/v2/statistics/ranking/marketplace?time=${timeRange}&sort_field=volume&sort_direction=desc`, config)
    const data = response.data.data
    return res.status(200).json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// get NFT Collection Rank
exports.getCollectionRank = async (req, res) => {

  const config = {
    headers: {
      "X-API-KEY": process.env.NFTSCAN_API_KEY,
    },
  };

  try {

    const response = await axios.get(`https://restapi.nftscan.com/api/v2/statistics/ranking/collection?sort_field=volume_1d&sort_direction=desc&limit=50`, config)
    const data = response.data.data
    return res.status(200).json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// get NFT MarketCap Rank
exports.getMarketCapRank = async (req, res) => {

  const config = {
    headers: {
      "X-API-KEY": process.env.NFTSCAN_API_KEY,
    },
  };

  try {

    const response = await axios.get(`https://restapi.nftscan.com/api/v2/statistics/ranking/marketcap`, config)
    const data = response.data.data
    return res.status(200).json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// get NFT Trade Rank
exports.getTradeRank = async (req, res) => {

  const config = {
    headers: {
      "X-API-KEY": process.env.NFTSCAN_API_KEY,
    },
  };

  try {

    const response = await axios.get(`https://restapi.nftscan.com/api/v2/statistics/ranking/trade?time=1d&sort_field=volume&sort_direction=desc&show_7d_trends=false`, config)
    const data = response.data.data
    return res.status(200).json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// // get NFT Gas Rank
// exports.getGasRank = async (req, res) => {

//   const config = {
//     headers: {
//       "X-API-KEY": process.env.NFTSCAN_API_KEY,
//     },
//   };

//   try {

//     const response = await axios.get(`https://restapi.nftscan.com/api/v2/statistics/ranking/collection?sort_field=volume_1d&sort_direction=desc&limit=50`, config)
//     const data = response.data.data
//     return res.status(200).json(data)

//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }