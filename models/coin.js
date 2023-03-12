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
});

module.exports = mongoose.model("coin", schema);