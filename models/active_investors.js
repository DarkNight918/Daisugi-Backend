const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  investor: String,
  deals: String,
  projects: String,
});

module.exports = mongoose.model("active_investors", schema);