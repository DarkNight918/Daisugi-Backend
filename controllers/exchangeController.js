const CEX = require("../models/exchanges_cexes");
const DEX = require("../models/exchanges_dexes");

exports.getCEX = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await CEX.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    // Find, sort by volume, and apply pagination
    const cexData = await CEX.find()
      .sort({ volume: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    
    return res.status(200).json({ totalPages, cexData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDEX = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    // Get total page size
    const totalCount = await DEX.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    // Find, sort by volume, and apply pagination
    const dexData = await DEX.find()
      .sort({ volume: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    
    return res.status(200).json({ totalPages, dexData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
