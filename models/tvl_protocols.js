const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  symbol: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  chain: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
  audits: {
    type: String,
    default: '',
  },
  audit_note: {
    type: String,
    default: '',
  },
  gecko_id: {
    type: String,
    default: '',
  },
  cmcId: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  chains: {
    type: [String],
    default: [],
  },
  module: {
    type: String,
    default: '',
  },
  treasury: {
    type: String,
    default: '',
  },
  twitter: {
    type: String,
    default: '',
  },
  audit_links: {
    type: [String],
    default: [],
  },
  oracles: {
    type: [String],
    default: [],
  },
  listedAt: {
    type: Number,
    default: 0,
  },
  parentProtocol: {
    type: String,
    default: '',
  },
  slug: {
    type: String,
    default: '',
  },
  tvl: {
    type: Number,
    default: 0,
  },
  chainTvls: {
    type: Object,
    default: {},
  },
  change_1h: {
    type: Number,
    default: 0,
  },
  change_1d: {
    type: Number,
    default: 0,
  },
  change_7d: {
    type: Number,
    default: 0,
  },
  tokenBreakdowns: {
    type: Object,
    default: {},
  }
});

module.exports = mongoose.model("tvl_protocols", schema);
