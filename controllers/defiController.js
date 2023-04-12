const Chain = require("../models/chains");
const TvlProtocols = require("../models/tvl_protocols");
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
      .select('chainFullName chainShortName tvl')
    
    return res.status(200).json({ totalPages, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTvlProtocol = async (req, res) => {

  try {

    // const page = parseInt(req.query.page) || 1;
    // const pageSize = parseInt(req.query.pageSize) || 25;
    
    // Get total page size
    // const totalCount = await Chain.countDocuments({ tvl: { $ne: null } });
    // const totalPages = Math.ceil(totalCount / pageSize);
    
    // Find, sort by volume, and apply pagination
    const data = await Chain.find({ tvl: { $ne: null } })
      .sort({ tvl: -1 })
      // .skip((page - 1) * pageSize)
      // .limit(pageSize)
      .select('chainFullName chainShortName tvl')
    
    return res.status(200).json({ data });
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
    const totalCount = await DEX.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // Find, sort by volume, and apply pagination
    const data = await DEX.find()
      .sort({ tvl: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('chainFullName chainShortName tvl')
    
    return res.status(200).json({ data });
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
    const data = await POOL.find()
      .sort({ volumePrevDay: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
    
    return res.status(200).json({ totalPages, data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};