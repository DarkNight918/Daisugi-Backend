const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  exchange_name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  support_spot: {
    type: Boolean,
    default: false,
  },
  support_derivatives: {
    type: Boolean,
    default: false,
  },
  rating_spot: {
    type: String,
    default: '',
  },
  rating_spot_date: {
    type: Number,
    default: 0,
  },
  rating_derivatives: {
    type: String,
    default: '',
  },
  rating_derivatives_date: {
    type: Number,
    default: 0,
  },
  vol_spot_24h: {
    type: Number,
    default: 0,
  },
  vol_derivatives_24h: {
    type: Number,
    default: 0,
  },
  open_interest: {
    type: Number,
    default: 0,
  },
  imgURL: {
    type: String,
    default: '',
  },
  volume: {
    type: Number,
    default: 0,
  },
  bidTotal: {
    type: Number,
    default: 0,
  },
  askTotal: {
    type: Number,
    default: 0,
  },
  depth: {
    type: Number,
    default: 0,
  },
  visitors: {
    type: Number,
    default: 0,
  },
  volumePerVisitor: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("exchanges_cexes", schema);
