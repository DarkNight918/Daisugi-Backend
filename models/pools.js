const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  chain: {
    type: String,
    default: '',
  },
  project: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    default: '',
  },
  tvlUsd: {
    type: Number,
    default: 0,
  },
  apyBase: {
    type: Number,
    default: 0,
  },
  apyReward: {
    type: Number,
    default: 0,
  },
  apy: {
    type: Number,
    default: 0,
  },
  rewardTokens: {
    type: [String],
    default: [],
  },
  pool: {
    type: String,
    default: '',
  },
  apyPct1D: {
    type: Number,
    default: 0,
  },
  apyPct7D: {
    type: Number,
    default: 0,
  },
  apyPct30D: {
    type: Number,
    default: 0,
  },
  stablecoin: {
    type: Boolean,
    default: false,
  },
  ilRisk: {
    type: String,
    default: '',
  },
  exposure: {
    type: String,
    default: '',
  },
  predictions: {
    type: Object,
    default: {},
  },
  poolMeta: {
    type: String,
    default: '',
  },
  mu: {
    type: Number,
    default: 0,
  },
  sigma: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
  outlier: {
    type: Boolean,
    default: false,
  },
  underlyingTokens: {
    type: [String],
    default: [],
  },
  il7d: {
    type: Number,
    default: 0,
  },
  apyBase7d: {
    type: Number,
    default: 0,
  },
  apyMean30d: {
    type: Number,
    default: 0,
  },
  volumeUsd1d: {
    type: Number,
    default: 0,
  },
  volumeUsd7d: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("pools", schema);