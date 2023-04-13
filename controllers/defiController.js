const Chain = require("../models/chains");
const Protocols = require("../models/protocols");
const DEX = require("../models/exchanges_dexes");
const POOL = require("../models/pools");
const Bridge = require("../models/bridges");

exports.getTvlChain = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await Chain.countDocuments({ tvl: { $ne: null } });
    const totalPages = Math.ceil(totalCount / pageSize);

    // Find, sort by volume, and apply pagination
    const data = await Chain.find({ tvl: { $ne: null } })
      .sort({ tvl: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("chainFullName chainShortName tvl");

    return res.status(200).json({ totalPages, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTvlProtocol = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await Protocols.countDocuments({ tvl: { $ne: null } });
    const totalPages = Math.ceil(totalCount / pageSize);

    // Find, sort by volume, and apply pagination
    const data = await Protocols.find()
      .sort({ tvl: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("name category chain chains change_1h change_1d change_7d logo tvl");

    return res.status(200).json({ totalPages, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getFee = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await Protocols.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    // Find, sort by volume, and apply pagination
    const data = await Protocols.find()
      .sort({ dailyFees: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select("name category chain chains dailyFees dailyRevenue logo tvl");

    return res.status(200).json({ totalPages, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getYield = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await POOL.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    // Find, sort by volume, and apply pagination
    const data = await POOL.find()
      .sort({ tvlUsd: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('project chain symbol tvlUsd apy apyPct1D apyPct7D apyPct30D predictions')

    return res.status(200).json({ totalPages, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getBridge = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await Bridge.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    // Find, sort by volume, and apply pagination
    const data = await Bridge.find()
      .sort({ volumePrevDay: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('displayName icon chains volumePrevDay lastHourlyVolume lastDailyVolume currentDayVolume weeklyVolume')

    return res.status(200).json({ totalPages, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
