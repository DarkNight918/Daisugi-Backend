const express = require('express')
const router = express.Router();
const coinController = require('../controllers/coinController');

router.get('/getall', coinController.getAll)
router.get('/total_gainers', coinController.getTotalGainers)
router.get('/total_losers', coinController.getTotalLosers)
router.get('/gainers', coinController.getGainers)
router.get('/losers', coinController.getLosers)
router.get('/topcoins', coinController.getTopCoins);
router.get('/stablecoins', coinController.getStableCoins);
router.get('/:name', coinController.getCoinByName);

module.exports = router;