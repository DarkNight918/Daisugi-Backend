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
  athPrice: {
    type: Number,
    default: 0,
  },
  athDate: {
    type: Date,
    default: '',
  },
  atlPrice: {
    type: Number,
    default: 0,
  },
  atlDate: {
    type: Date,
    default: '',
  },
  fromATH: {
    type: Number,
    default: 0,
  },
  fromATL: {
    type: Number,
    default: 0,
  },
  platforms: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  community: {
    type: Object,
    default: {},
  },
  explorer: {
    type: String,
    default: '',
  },
  code: {
    type: String,
    default: '',
  }
});

module.exports = mongoose.model("coin", schema);