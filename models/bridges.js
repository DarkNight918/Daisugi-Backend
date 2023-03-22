const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  id: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  volumePrevDay: {
    type: Number,
    default: 0,
  },
  volumePrev2Day: {
    type: Number,
    default: 0,
  },
  lastHourlyVolume: {
    type: Number,
    default: 0,
  },
  currentDayVolume: {
    type: Number,
    default: 0,
  },
  lastDailyVolume: {
    type: Number,
    default: 0,
  },
  dayBeforeLastVolume: {
    type: Number,
    default: 0,
  },
  weeklyVolume: {
    type: Number,
    default: 0,
  },
  monthlyVolume: {
    type: Number,
    default: 0,
  },
  chains: {
    type: [String],
    default: [],
  },
  destinationChain: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model("bridges", schema);