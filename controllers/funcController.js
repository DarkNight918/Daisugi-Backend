
const axios = require('axios');
const cheerio = require('cheerio');

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