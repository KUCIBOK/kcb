const express = require('express');
const router = express.Router();
const { admin, auth } = require('../middleware/auth');
const {
  collectAnalytics,
  getLatestAnalytics,
  getAnalyticsHistory,
  getSystemHealth,
} = require('../controllers/analytics.controller');

// Routes admin
router.post('/collect', admin, collectAnalytics);
router.get('/latest', admin, getLatestAnalytics);
router.get('/history', admin, getAnalyticsHistory);
router.get('/health', admin, getSystemHealth);

module.exports = router;
