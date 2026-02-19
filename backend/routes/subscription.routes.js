const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscription.controller");
const { admin, auth } = require("../middleware/auth");

router.post("/", auth, controller.create);
router.get("/:id", auth, controller.getSubscriptionById)
router.get("/active", admin, controller.getActiveSubscriptions);
router.get("/", admin, controller.getAllSubscriptions);
router.get("/user/:userId", auth, controller.getUserActiveSubscription);
router.get('/activate/:subId', auth, controller.activateSubscription)
router.get('/fail/:subId', auth, controller.failSubscription)

module.exports = router;
