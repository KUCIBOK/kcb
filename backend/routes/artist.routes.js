const express = require("express");
const router = express.Router();
const multer = require("../middleware/multer");
const { auth } = require("../middleware/auth");
const {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  updateManagedArtist,
  deleteArtist,
  getRandomArtists,
  getArtistAndUpdateVisited,
  getManagedArtistsByUserId,
} = require("../controllers/artist.controllers");

router.post("/", auth, multer, createArtist);

// GET /api/artist → Liste de tous les artistes
router.get("/", getAllArtists);

router.get("/random", getRandomArtists);

// GET /api/artist/:id → Détail d’un artiste
router.get("/:id", getArtistById);

router.put("/:id", auth, multer, updateArtist);

router.get("/managed/:id", auth, getManagedArtistsByUserId);

router.put("/managed/:id", auth, multer, updateManagedArtist);

router.delete("/:id", deleteArtist);

router.get("/visited/:id", getArtistAndUpdateVisited); // This route is used to get artist and update visited count

module.exports = router;
