const Coin = require("../models/coins");
const TopCoins = require("../models/coin_toplists");
const { stableCoins } = require('../data/data')

exports.getCoinByName = async (req, res) => {
  const name = req.params.name;

  // Find coins with a case-insensitive regular expression to match the symbol field
  try {
    const coins = await Coin.find({
      name: { $regex: new RegExp("^" + name + "$", "i") },
    });

    if (!coins.length) {
      // Create a new coin with empty variables
      const newCoin = new Coin({
        name: name,
        symbol: "",
        price: [],
        rank: 0,
        inOutOfTheMoneyHistory: [],
        breakEvenPriceHistory: [],
        volatility: [],
        largeTxs: [],
      });
      await newCoin.save();
      return res.status(200).json({ coins: [newCoin] });
    }

    return res.status(200).json({ coins });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getStableCoins = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    const totalCount = await Coin.countDocuments({ symbol: { $in: stableCoins } });
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await Coin.find({ symbol: { $in: stableCoins } })
      .sort({ marketCap: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('name symbol imgURL marketCap price hourlyChanged weeklyChanged monthlyChanged quarterlyChanged yearlyChanged')
    
    return res.status(200).json({ totalPages, data });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTopCoins = async (req, res) => {
  try {
    // Find all documents in the TopCoins collection
    const topCoins = await TopCoins.find({});

    return res.status(200).json({ topCoins });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAll = async (req, res) => {

  // Find coins with a case-insensitive regular expression to match the symbol field
  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await Coin.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const coins = await Coin.find({})
      .sort({ marketCap: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('name symbol imgURL marketCap price hourlyChanged weeklyChanged monthlyChanged quarterlyChanged yearlyChanged')
    
    return res.status(200).json({totalPages, data : coins});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTotalGainers = async (req, res) => {

  // Find coins with a case-insensitive regular expression to match the symbol field
  try {

    const coins = await Coin.find({ dailyChanged: {$gt: 1} })
      .sort({ dailyChanged: -1 })
      .limit(5)
      .select('name symbol imgURL price dailyChanged')
    
    return res.status(200).json(coins);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTotalLosers = async (req, res) => {

  // Find coins with a case-insensitive regular expression to match the symbol field
  try {

    const coins = await Coin.find({ dailyChanged: {$gt: 0} })
      .sort({ dailyChanged: 1 })
      .limit(5)
      .select('name symbol imgURL price dailyChanged')
    
    return res.status(200).json(coins);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCoinRanks = async (req, res) => {
  try {
    
    const gainers = await Coin.find()
      .sort({ rank: 1 })
      .limit(5)
      .select(
        'name symbol imgURL price hourlyChanged'
      );

    res.status(200).json(gainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getGainers = async (req, res) => {
  try {
    // Get sortfield from the params in API URL
    const sortField = Object.entries(req.query).find(([key, value]) => value === 'true');

    if (!sortField) {
      return res.status(400).json({ error: 'No valid sort field provided.' });
    }

    const [field, _] = sortField;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await Coin.countDocuments({ [field]: { $gt: 1 } });
    const totalPages = Math.ceil(totalCount / pageSize);
    
    const gainers = await Coin.find({ [field]: { $gt: 1 } })
      .sort({ [field]: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(
        'name symbol imgURL marketCap price hourlyChanged weeklyChanged monthlyChanged quarterlyChanged yearlyChanged'
      );

    res.status(200).json({ totalPages, gainers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getLosers = async (req, res) => {
  try {
    // Get sortfield from the params in API URL
    const sortField = Object.entries(req.query).find(([key, value]) => value === 'true');

    if (!sortField) {
      return res.status(400).json({ error: 'No valid sort field provided.' });
    }

    const [field, _] = sortField;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await Coin.countDocuments({ [field]: { $lt: 1, $gt: 0 } });
    const totalPages = Math.ceil(totalCount / pageSize);

    const losers = await Coin.find({ [field]: { $lt: 1, $gt: 0 } })
      .sort({ [field]: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(
        'name symbol imgURL marketCap price hourlyChanged weeklyChanged monthlyChanged quarterlyChanged yearlyChanged'
      );

    res.status(200).json({ totalPages, losers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}