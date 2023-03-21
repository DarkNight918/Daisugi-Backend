const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  volume: {
    type: Number,
    default: 0,
  },
  trades_total: {
    type: Number,
    default: 0,
  }
})

const schema = new mongoose.Schema({
  account: {
    type: String,
    required: true,
  },
  chain: {
    type: String,
    required: true,
  },
  buy1h: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  buy6h: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  buy12h: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  buy1d: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  buy3d: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  sell1h: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  sell6h: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  sell12h: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  sell1d: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
  sell3d: {
    type: dataSchema,
    default: {volume: 0, trades_total: 0},
  },
});

module.exports = mongoose.model("nft_traders", schema);