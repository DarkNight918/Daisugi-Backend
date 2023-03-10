const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    default: ''
  },
  price: [{
    type: Object,
    default: [],
  }],
  rank: {
    type: Number,
    default: null
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
});

module.exports = mongoose.model("coin", schema);