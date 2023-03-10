const express = require('express')
const router = express.Router();
const coinController = require('../controllers/coinController');

router.get('/:name', coinController.getCoinByName);

module.exports = router;