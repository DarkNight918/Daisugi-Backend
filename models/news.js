const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: '',
  },
  publisher: {
    type: Object,
    default: {},
  },
  keywords: {
    type: [String],
    default: [],
  },
  author: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model("news", schema);