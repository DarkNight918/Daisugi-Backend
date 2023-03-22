const Coin = require("../models/coins");

const publishAllInfo = (socket, startNum = 0) => {
  const publishInfo = async () => {
    try {
      const coinData = await Coin.find({ rank: { $gt: startNum } })
        .sort({ rank: 1 })
        .limit(50)
        .select({
          name: 1,
          symbol: 1,
          imgURL: 1,
          marketCap: 1,
          price: 1,
          rank: 1,
          hourlyChanged: 1,
          dailyChanged: 1,
          weeklyChanged: 1,
          monthlyChanged: 1,
          quarterlyChanged: 1,
          yearlyChanged: 1,
          inOutOfTheMoneyHistory: { $slice: -1 },
          breakEvenPriceHistory: { $slice: -1 },
          volatility: { $slice: -1 },
          largeTxs: { $slice: -1 },
          volume: 1,
          athPrice: 1,
          athDate: 1,
          atlPrice: 1,
          atlDate: 1,
          platforms: 1,
          website: 1,
          community: 1,
          explorer: 1,
          code: 1,
        });

      socket.emit("TotalCoinInfo", { coinData, startNum });
    } catch (err) {
      console.log(err);
    }
  };

  publishInfo();

  // Call the publish info every second
  // setInterval(publishInfo, 1000);
};

module.exports = publishAllInfo;
