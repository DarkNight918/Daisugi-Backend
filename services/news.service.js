const axios = require('axios');
const newsData = require('../models/news')

// NewsAPI ------------------ get news about Blockchain with Rapid News.

const getNewsArticles = async () => {

  // const config = {
  //   headers: {
  //     "X-RapidAPI-Key": process.env.RAPIDNEWS_API_KEY,
  //     "X-RapidAPI-Host": "news-api14.p.rapidapi.com",
  //   }
  // }

  // const newsAPI = 'https://news-api14.p.rapidapi.com/search?q=blockchain&language=en&pageSize=100&sortBy=timestamp'

  // try {

  //   const response = await axios.get(newsAPI, config);
  //   const news = response.data.articles;

  //   console.log(`OkLink ---------- Rich address is successfully updated.`);
  // } catch (error) {
  //   console.log(`OkLink --------- rich address update error:${error}`)
  // }
}

module.exports = {
  // getNewsArticles,
}