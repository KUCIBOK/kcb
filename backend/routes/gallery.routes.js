const express = require("express");
const {
  getGalleries,
  importGalleries,
} = require("../controllers/gallery.controller.js");
const { auth, admin } = require("../middleware/auth");
const uploadExcel = require("../middleware/multerExcelFiles");

const router = express.Router();

router.get("/", admin, getGalleries);
router.post("/import", admin, uploadExcel, importGalleries);

module.exports = router;
