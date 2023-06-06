const express = require('express')
const router = express.Router();
const funcController = require('../controllers/funcController');

router.get('/link-preview', funcController.getLinkPreview)
router.get('/investments', funcController.getInvestmentsData)
router.get('/active_investors', funcController.getActiveInvestors)
router.get('/ventures', funcController.getVentures)

module.exports = router;