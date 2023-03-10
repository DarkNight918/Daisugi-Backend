const Coin = require("../models/coin");

exports.getCoinByName = async (req, res) => {
  const name = req.params.name;

  // Find coins with a case-insensitive regular expression to match the symbol field
  try {
    const coins = await Coin.find({ name: { $regex: new RegExp('^' + name + '$', 'i') } });

    if (!coins.length) {
      // Create a new coin with empty variables
      const newCoin = new Coin({
        name: name,
        symbol: '',
        price: [],
        rank: null,
        inOutOfTheMoneyHistory: [],
        breakEvenPriceHistory: [],
        volatility: [],
        largeTxs: []
      })
      await newCoin.save();
      return res.status(200).json({ coins: [newCoin] });
    }

    return res.status(200).json({ coins });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
