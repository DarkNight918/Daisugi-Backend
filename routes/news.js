const express = require('express')
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/top_news', newsController.getTopNews)

module.exports = router;