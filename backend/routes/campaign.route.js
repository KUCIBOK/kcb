const express = require('express')
const router = express.Router()
const campaignController = require('../controllers/campaign.controller')
const {admin} = require('../middleware/auth')

router.post('/dispatch', admin, campaignController.dispatchCampaignMail)

module.exports = router