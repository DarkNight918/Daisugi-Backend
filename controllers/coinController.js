const Coin = require("../models/coins");
const TopCoins = require("../models/coin_toplists");

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
