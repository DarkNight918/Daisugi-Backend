const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    default: '',
  },
  imgURL: {
    type: String,
    default: '',
  },
  marketCap: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  priceList: [{
    type: Object,
    default: [],
  }],
  rank: {
    type: Number,
    default: 0
  },
  hourlyChanged: {
    type: Number,
    default: 0,
  },
  dailyChanged: {
    type: Number,
    default: 0,
  },
  weeklyChanged: {
    type: Number,
    default: 0,
  },
  monthlyChanged: {
    type: Number,
    default: 0,
  },
  quarterlyChanged: {
    type: Number,
    default: 0,
  },
  yearlyChanged: {
    type: Number,
    default: 0,
  },
  inOutOfTheMoneyHistory: [{
    type: Object,
    default: [],
  }],
  breakEvenPriceHistory: [{
    type: Object,
    default: [],
  }],
  volatility: [{
    type: Object,
    default: [],
  }],
  largeTxs: [{
    type: Object,
    default: [],
  }],
  volume: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Object,
    default: {},
  },
  block_explorers: [{
    type: String,
    default: '',
  }],
  platforms: [{
    type: Object,
    default: {},
  }],
  website: [{
    type: String,
    default: '',
  }],
  community: {
    type: Object,
    default: {},
  },
  resource: {
    type: Object,
    default: {},
  },
  code: [{
    type: String, 
    default: '',
  }],
  investors: [{
    type: String,
    default: '',
  }],
  localization: [{
    type: Object,
    default: {},
  }],
  market_data: {
    type: Object,
    default: {},
  },
  tickers: [{
    type: Object,
    default: {},
  }],
});

module.exports = mongoose.model("coins", schema);