const express = require('express')
const router = express.Router();
const NFTController = require('../controllers/nftController');

router.get('/influencers', NFTController.getNFTInfluencers)
router.get('/marketplace', NFTController.getNFTMarketplace)
router.get('/collection', NFTController.getCollectionRank)
router.get('/marketcap', NFTController.getMarketCapRank)
router.get('/trade', NFTController.getTradeRank)
router.get('/gas', NFTController.getGasRank)
router.get('/traders', NFTController.getTradersRank)
router.get('/trader_wallet', NFTController.getTradersWallet)
router.get('/wallet_trade', NFTController.getWalletTradeRank)
router.get('/mint_rank', NFTController.getNFTMintRank)
router.get('/mint_amount', NFTController.getNFTMintAmount)
router.get('/sol_rank', NFTController.getSolanaNFTRank)
router.get('/apt_rank', NFTController.getAptosNFTRank)

module.exports = router;