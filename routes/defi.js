const express = require('express')
const router = express.Router();
const defiController = require('../controllers/defiController');

router.get('/tvlchain', defiController.getTvlChain)
router.get('/getprotocol', defiController.getTvlProtocol)
router.get('/getfee', defiController.getFee)
router.get('/getyield', defiController.getYield)
router.get('/getbridge', defiController.getBridge)

module.exports = router;