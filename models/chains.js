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
  tvl: {
    type: Number,
    default: 0,
  },
  chainId: {
    type: Number,
    default: 0,
  },
  lastHeight: {
    type: String,
    default: '',
  },
  lastBlockTime: {
    type: String,
    default: '',
  },
  circulatingSupply: {
    type: String,
    default: '',
  },
  circulatingSupplyProportion: {
    type: String,
    default: '',
  },
  transactions: {
    type: String,
    default: '',
  },
  mineable: {
    type: Boolean,
    default: false,
  },
  algorithm: {
    type: String,
    default: '',
  },
  consensus: {
    type: String,
    default: '',
  },
  diffEstimation: {
    type: String,
    default: '',
  },
  currentDiff: {
    type: String,
    default: '',
  },
  diffAdjustTime: {
    type: String,
    default: '',
  },
  circulatingSupply: {
    type: String,
    default: '',
  },
  totalSupply: {
    type: String,
    default: '',
  },
  tps: {
    type: String,
    default: '',
  },
  issueDate: {
    type: String,
    default: '',
  },
  validAddressCount: {
    type: String,
    default: '',
  },
  newAddressCount24h: {
    type: String,
    default: '',
  },
  totalAddresses: {
    type: String,
    default: '',
  },
  newTotalAddresses24h: {
    type: String,
    default: '',
  },
  contractAddresses: {
    type: String,
    default: '',
  },
  newContractAddresses24h: {
    type: String,
    default: '',
  },
  externalAddresses: {
    type: String,
    default: '',
  },
  newExternalAddresses24h: {
    type: String,
    default: '',
  },
  activeAddresses: {
    type: String,
    default: '',
  },
  newActiveAddresses: {
    type: String,
    default: '',
  },
  bestTransactionFee: {
    type: String,
    defaut: '',
  },
  recommendedGasPrice: {
    type: String,
    defaut: '',
  },
  rapidGasPrice: {
    type: String,
    defaut: '',
  },
  standardGasPrice: {
    type: String,
    defaut: '',
  },
  slowGasPrice: {
    type: String,
    defaut: '',
  },
  hashRate: {
    type: String,
    defaut: '',
  },
  hashRateChange24h: {
    type: String,
    defaut: '',
  },
  avgMineReward24h: {
    type: String,
    defaut: '',
  },
  minerIncomePerUnit: {
    type: String,
    defaut: '',
  },
  minerIncomePerUnitCoin: {
    type: String,
    defaut: '',
  },
  pendingTransactionCount: {
    type: String,
    defaut: '',
  },
  transactionValue24h: {
    type: String,
    defaut: '',
  },
  totalTransactionCount: {
    type: String,
    defaut: '',
  },
  tranRate: {
    type: String,
    defaut: '',
  },
  avgTransactionCount24h: {
    type: String,
    defaut: '',
  },
  avgTransactionCount24hPercent: {
    type: String,
    defaut: '',
  },
  pendingTransactionSize: {
    type: String,
    defaut: '',
  },
});

module.exports = mongoose.model("chains", schema);