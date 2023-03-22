const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  marketPlace: {
    type: String,
    required: true,
  },
  chain: {
    type: String,
    required: true,
  },
  imgURL: {
    type: String,
    default: '',
  },
  contracts1d: {
    type: Object,
    default: {},
  },
  contracts7d: {
    type: Object,
    default: {},
  },
  contracts30d: {
    type: Object,
    default: {},
  },
  volume1d: {
    type: Number,
    default: 0,
  },
  volume7d: {
    type: Number,
    default: 0,
  },
  volume30d: {
    type: Number,
    default: 0,
  },
  gas1d: {
    type: Number,
    default: 0,
  },
  gas7d: {
    type: Number,
    default: 0,
  },
  gas30d: {
    type: Number,
    default: 0,
  },
  sales1d: {
    type: Number,
    default: 0,
  },
  sales7d: {
    type: Number,
    default: 0,
  },
  sales30d: {
    type: Number,
    default: 0,
  },
  wallets1d: {
    type: Number,
    default: 0,
  },
  wallets7d: {
    type: Number,
    default: 0,
  },
  wallets30d: {
    type: Number,
    default: 0,
  },
  volume1d_change: {
    type: Number,
    default: 0,
  },
  volume7d_change: {
    type: Number,
    default: 0,
  },
  volume30d_change: {
    type: Number,
    default: 0,
  },
  fee: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("nft_marketplaces", schema);