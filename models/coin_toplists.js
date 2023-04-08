const mongoose = require('mongoose')

const ExchangeSchema = new mongoose.Schema({
  address: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  iconURL: {
    type: String,
    default: '',
  },
  networkID: {
    type: Number,
    default: 0,
  },
  tradeURL: {
    type: String,
    default: ''
  }
})

const schema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  chain: {
    type: String,
    default: '',
  },
  decimals: {
    type: Number,
    default: 0,
  },
  exchanges: [{
    type: Object,
    default: {},
  }],
  id: {
    type: String,
    default: '',
  },
  liquidity: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  networkId: {
    type: Number,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  priceChange: {
    type: Number,
    default: 0,
  },
  resolution: {
    type: String,
    default: '',
  },
  symbol: {
    type: String,
    default: '',
  },
  topPairId: {
    type: String,
    default: '',
  },
  volume: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model("coin_toplists", schema);