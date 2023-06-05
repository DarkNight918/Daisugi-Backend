const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  oneday: mongoose.Schema.Types.Mixed,
  oneweek: mongoose.Schema.Types.Mixed,
  onemonth: mongoose.Schema.Types.Mixed,
  threemonths: mongoose.Schema.Types.Mixed,
  sixmonths: mongoose.Schema.Types.Mixed,
  oneyear: mongoose.Schema.Types.Mixed,
  twoyears: mongoose.Schema.Types.Mixed,
  all: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model("coin_influencers", schema);