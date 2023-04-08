const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  contract_address: {
    type: String,
    required: true,
  },
  chainName: {
    type: String,
    default: '',
  },
  contract_name: {
    type: String,
    default: '',
  },
  mint_total: {
    type: Number,
    default: 0,
  },
  logo_url: {
    type: String,
    default: '',
  },
  mint_cost: {
    type: Number,
    default: 0,
  },
  sale_total: {
    type: Number,
    default: 0,
  },
  floor_price: {
    type: Number,
    default: 0,
  },
  lowest_price: {
    type: Number,
    default: 0,
  },
  average_price: {
    type: Number,
    default: 0,
  },
  highest_price: {
    type: Number,
    default: 0,
  },
  volume: {
    type: Number,
    default: 0,
  },
  sales: {
    type: Number,
    default: 0,
  },
  sales_change: {
    type: String,
    default: '',
  },
  mint_price_total: {
    type: Number,
    default: 0,
  },
  mint_gas_fee: {
    type: Number,
    default: 0,
  },
  exchange_volume_change_24h: {
    type: String,
    default: '',
  },
  exchange_volume_change_7d: {
    type: String,
    default: '',
  },
  items_total: {
    type: Number,
    default: 0,
  },
  amounts_total: {
    type: Number,
    default: 0,
  },
  owners_total: {
    type: Number,
    default: 0,
  },
  volume_change: {
    type: String,
    default: '',
  },
  average_price_change: {
    type: String,
    default: '',
  },
  market_cap: {
    type: Number,
    default: 0,
  },
  market_trend: {
    type: String,
    default: '',
  },
  mint_average_price: {
    type: Number,
    default: 0,
  },
  volume_7d: [{
    type: Object,
    default: {},
  }],
  price_7d: [{
    type: Object,
    default: {},
  }],
  gas_fee_1h: {
    type: Number,
    default: 0,
  },
  gas_fee_12h: {
    type: Number,
    default: 0,
  },
  gas_fee_24h: {
    type: Number,
    default: 0,
  },
  gas_24h: [{
    type: Object,
    default: {},
  }],
});

module.exports = mongoose.model("nft_trendings", schema);