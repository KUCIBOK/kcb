const express = require("express");
const router = express.Router();
const controller = require("../controllers/log.controller");
const { admin } = require("../middleware/auth");

router.post("/", controller.createLog);

router.get("/", admin, controller.geAllLogs);

module.exports = router;
