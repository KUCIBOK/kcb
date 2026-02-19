const express = require("express");
const router = express.Router();
const integrationController = require("../controllers/integration.controller");
const { auth } = require("../middleware/auth");

// ✅ Get all integrations
router.get("/", auth, integrationController.getIntegrations);

// ✅ Get integration stats
router.get("/stats", auth, integrationController.getIntegrationStats);

// ✅ Get single integration
router.get("/:id", auth, integrationController.getIntegration);

// ✅ Connect integration
router.post("/", auth, integrationController.connectIntegration);

// ✅ Update integration settings
router.put("/:id", auth, integrationController.updateIntegration);

// ✅ Sync integration
router.post("/:id/sync", auth, integrationController.syncIntegration);

// ✅ Disconnect integration
router.delete("/:id", auth, integrationController.disconnectIntegration);

module.exports = router;
