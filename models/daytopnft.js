const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: Number,
    required: true,
  },
  lunar_id: {
    type: String,
    default: '',
  },
  updated_date: {
    type: Date,
    default: '',
  }
});

module.exports = mongoose.model("daytopnft", schema);