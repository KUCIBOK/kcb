const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { admin } = require("../middleware/auth");

router.post("/", admin, categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getCategoryById);

router.delete("/", admin, categoryController.deleteAllCategories);

router.delete("/:id", admin, categoryController.deleteCategory);

module.exports = router;
