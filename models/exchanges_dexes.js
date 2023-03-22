const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  displayName: {
    type: String,
    default: "",
  },
  module: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  logo: {
    type: String,
    default: "",
  },
  change_1d: {
    type: Number,
    default: 0,
  },
  change_7d: {
    type: Number,
    default: 0,
  },
  change_1m: {
    type: Number,
    default: 0,
  },
  change_7dover7d: {
    type: Number,
    default: 0,
  },
  change_30dover30d: {
    type: Number,
    default: 0,
  },
  total24h: {
    type: Number,
    default: 0,
  },
  total48hto24h: {
    type: Number,
    default: 0,
  },
  total7d: {
    type: Number,
    default: 0,
  },
  total30d: {
    type: Number,
    default: 0,
  },
  total14dto7d: {
    type: Number,
    default: 0,
  },
  total60dto30d: {
    type: Number,
    default: 0,
  },
  totalAllTime: {
    type: Number,
    default: 0,
  },
  breakdown24h: {
    type: Object,
    default: {},
  },
  chains: {
    type: [String],
    default: [],
  },
  protocolType: {
    type: String,
    default: '',
  },
  methodologyURL: {
    type: String,
    default: '',
  },
  methodology: {
    type: Object,
    default: {},
  },
  latestFetchIsOk: {
    type: Boolean,
    default: false,
  },
  versionKey: {
    type: String,
    default: '',
  },
  dailyVolume: {
    type: Number,
    default: 0,
  },
  parentProtocol: {
    type: String,
    default: '',
  },
  dailyRevenue: {
    type: Number,
    default: 0,
  },
  dailyUserFees: {
    type: Number,
    default: 0,
  },
  dailyHoldersRevenue: {
    type: Number,
    default: 0,
  },
  dailyCreatorRevenue: {
    type: Number,
    default: 0,
  },
  dailySupplySideRevenue: {
    type: Number,
    default: 0,
  },
  dailyProtocolRevenue: {
    type: Number,
    default: 0,
  },
  dailyFees: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("exchanges_dexes", schema);
