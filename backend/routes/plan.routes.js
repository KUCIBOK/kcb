const express = require("express");
const router = express.Router();
const controller = require("../controllers/plans.controller");
const { admin } = require("../middleware/auth");

router.post("/", admin, controller.createPlan);

router.get("/", controller.getAllPlans);

router.get("/:id", controller.getPlanById);

router.put("/:id", admin, controller.updatePlan);

router.delete("/", admin, controller.deleteAll);

router.delete("/:id/feature/:index", admin, controller.deleteFeature);

router.delete("/:id", admin, controller.deletePlan);

module.exports = router;
