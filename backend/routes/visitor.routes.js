const express = require("express");
const router = express.Router();
const controller = require("../controllers/visitor.controller");
const { admin } = require("../middleware/auth");

router.post("/", controller.createVisitor);

router.put("/visit-time", controller.setVisitTime);

router.get("/", admin, controller.getAllVisitors);

router.delete("/", admin, controller.deleteAllVisitors);

module.exports = router;
