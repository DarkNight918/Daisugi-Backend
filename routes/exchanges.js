const express = require('express')
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

router.get('/cex', exchangeController.getCEX)
router.get('/dex', exchangeController.getDEX)

module.exports = router;