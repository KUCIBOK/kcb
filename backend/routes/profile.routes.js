const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer");
const { auth } = require("../middleware/auth");
const {
  createProfile,
  getProfileByUserId,
  deleteProfile,
  updateProfile,
  getAllProfiles,
} = require("../controllers/profile.controllers");

router.get("/", getAllProfiles); // Récupérer tous les profils
router.post("/", multer, createProfile);
router.get("/:userId", getProfileByUserId);
router.put("/:userId", auth, multer, updateProfile); // Mettre à jour le profil d'un utilisateur par son ID
router.delete("/:userId", auth, deleteProfile); // Supprimer le profil d'un utilisateur par son ID

module.exports = router;
