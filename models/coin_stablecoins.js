const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    default: '',
  },
  gecko_id: {
    type: String,
    default: '',
  },
  pegType: {
    type: String,
    default: '',
  },
  priceSource: {
    type: String,
    default: '',
  },
  pegMechanism: {
    type: String,
    default: '',
  },
  circulating: {
    type: Object,
    default: {},
  },
  circulatingPrevDay: {
    type: Object,
    default: {},
  },
  circulatingPrevWeek: {
    type: Object,
    default: {},
  },
  circulatingPrevMonth: {
    type: Object,
    default: {},
  },
  chainCirculating: {
    type: Object,
    default: {},
  },
  chains: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("coin_stablecoins", schema);