const express = require("express");
const router = express.Router();
const {
  createWallet,
  getAllWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
} = require("../controllers/wallet.controller");

router.post("/", createWallet);

router.get("/:id", getWalletById);

router.get("/", getAllWallets);

router.put("/:id", updateWallet);

router.delete("/:id", deleteWallet);

module.exports = router;
