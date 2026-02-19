const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/professionalAnalytics.controller");
const { auth } = require("../middleware/auth");

// ✅ Get analytics
router.get("/", auth, analyticsController.getAnalytics);

// ✅ Get real-time stats
router.get("/realtime", auth, analyticsController.getRealTimeStats);

module.exports = router;
