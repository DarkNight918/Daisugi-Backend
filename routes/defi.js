const express = require('express')
const router = express.Router();
const defiController = require('../controllers/defiController');

router.get('/tvlchain', defiController.getTvlChain)
router.get('/getFee', defiController.getFee)
router.get('/getYield', defiController.getYield)
router.get('/getBridge', defiController.getBridge)

module.exports = router;