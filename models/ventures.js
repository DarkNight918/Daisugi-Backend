const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
});

module.exports = mongoose.model("ventures", schema);