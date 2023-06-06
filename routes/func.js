const express = require('express')
const router = express.Router();
const funcController = require('../controllers/funcController');

router.get('/link-preview', funcController.getLinkPreview)

module.exports = router;