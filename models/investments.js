const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  timestamp: String,
  date: String,
  amount_raised: String,
  round: String,
  description: String,
  lead_investor: String,
  category: String,
  source: String,
  valuation: String,
  chains: String,
  other_investors: String
});

module.exports = mongoose.model("investments", schema);