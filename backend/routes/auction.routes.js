// routes/auction.routes.js
const express = require("express");
const router = express.Router();
const {
  createAuction,
  getOngoingAuctions,
  getAuctionById,
  getAuctionDetails,
} = require("../controllers/auction.controller");
const { professional } = require("../middleware/auth");

// Seul un professionnel peut créer une enchère
router.post("/", professional, createAuction);
router.get("/ongoing", getOngoingAuctions);
router.get("/:id", getAuctionById);
router.get("/:id/details", getAuctionDetails);

module.exports = router;
