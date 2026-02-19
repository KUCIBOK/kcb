const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');
const { auth } = require('../middleware/auth');

// Campaign routes
router.get('/campaigns', auth, campaignController.getCampaigns);
router.get('/campaigns/:id', auth, campaignController.getCampaign);
router.post('/campaigns', auth, campaignController.createCampaign);
router.put('/campaigns/:id', auth, campaignController.updateCampaign);
router.delete('/campaigns/:id', auth, campaignController.deleteCampaign);

// Send operations
router.post('/campaigns/:id/send-test', auth, campaignController.sendTest);
router.post('/campaigns/:id/send', auth, campaignController.sendCampaign);

// Analytics
router.get('/campaigns/:id/analytics', auth, campaignController.getCampaignAnalytics);

// Tracking (no auth - public endpoints)
router.get('/track/open', campaignController.trackOpen);
router.get('/track/click', campaignController.trackClick);

module.exports = router;
