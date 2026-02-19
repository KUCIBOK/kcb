const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  syncWithLogidoo,
  getTrackingInfo,
  getLogidooExpeditions,
  getShippingRates,
  getDeliveryZones,
  getPickupPoints,
  updateFromLogidoo,
  cancelDelivery,
  createExpedition,
  getExpeditionByTracking
} = require('../controllers/logidoo.controller');

// Admin routes
router.post('/sync', admin, syncWithLogidoo);
router.get('/expeditions', admin, getLogidooExpeditions);
router.post('/rates', admin, getShippingRates);
router.get('/zones', getDeliveryZones);
router.get('/pickup-points', getPickupPoints);

// Create new expedition
router.post('/expeditions', admin, createExpedition);

// Public tracking route (no auth required)
router.get('/track/:trackingId', (req, res, next) => {
  // Remove auth requirement for public tracking
  getTrackingInfo(req, res, next);
});

// Get expedition by tracking number (public)
router.get('/expeditions/track/:trackingNumber', getExpeditionByTracking);

// Admin actions
router.put('/update/:trackingId', admin, updateFromLogidoo);
router.delete('/cancel/:trackingId', admin, cancelDelivery);

module.exports = router;
