
const axios = require('axios');
const cheerio = require('cheerio');
const Investments = require("../models/investments")
const ActiveInvestors = require("../models/active_investors")
const Ventures = require('../models/ventures')

exports.getLinkPreview = async (req, res) => {

  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $('meta[property="og:title"]').attr('content');
    const description = $('meta[property="og:description"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');

    res.json({
      title: title || $('title').text(),
      description,
      image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching link preview');
  }
};

exports.getInvestmentsData = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    const totalCount = await Investments.countDocuments({});
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await Investments.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('name date amount_raised round description lead_investor category source chains')
    
    return res.status(200).json({ totalPages, data });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getActiveInvestors = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    const totalCount = await ActiveInvestors.countDocuments({});
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await ActiveInvestors.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('investor deals projects')
    
    return res.status(200).json({ totalPages, data });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getVentures = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 25;

    const totalCount = await Ventures.countDocuments({});
    const totalPages = Math.ceil(totalCount / pageSize);

    const data = await Ventures.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('name description image')
    
    return res.status(200).json({ totalPages, data });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}