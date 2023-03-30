const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  chainFullName: {
    type: String,
    required: true,
  },
  chainShortName: {
    type: String,
    default: '',
  },
  symbol: {
    type: String,
    default: '',
  },
  rank: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  amount: {
    type: String,
    default: '',
  },
  transactionCount: {
    type: String,
    default: '',
  },
  holdRatio: {
    type: String,
    default: '',
  },
  netWork: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model("address_rich", schema);