const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tokenSymbol: {
    type: String,
    default: '',
  },
  chainId: {
    type: Number,
    default: 0,
  },
  gecko_id: {
    type: String,
    default: '',
  },
  cmcId: {
    type: String,
    default: '',
  },
  tvl: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("tvl_chain", schema);
