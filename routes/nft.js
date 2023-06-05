const express = require('express')
const router = express.Router();
const NFTController = require('../controllers/nftController');

router.get('/influencers', NFTController.getNFTInfluencers)
router.get('/marketplace', NFTController.getNFTMarketplace)
router.get('/collection', NFTController.getCollectionRank)
router.get('/marketcap', NFTController.getMarketCapRank)

module.exports = router;