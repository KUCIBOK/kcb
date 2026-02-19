const express = require("express");
const router = express.Router();
const {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} = require("../controllers/collection.controller");
const { auth } = require("../middleware/auth");

router.post("/", auth, createCollection);

router.get("/", getAllCollections);

router.get("/:id", getCollectionById);

router.put("/:id", auth, updateCollection);

router.delete("/:id", auth, deleteCollection);

module.exports = router;
