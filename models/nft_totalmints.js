const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  oneHour: {
    type: Number,
    default: 0,
  },
  sixHours: {
    type: Number,
    default: 0,
  },
  twelveHours: {
    type: Number,
    default: 0,
  },
  oneDay: {
    type: Number,
    default: 0,
  },
  threeDays: {
    type: Number,
    default: 0,
  },
  sevenDays: {
    type: Number,
    default: 0,
  },
  oneMonth: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("nft_totalmints", schema);