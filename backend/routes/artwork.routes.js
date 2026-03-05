const express = require("express");
const artworkController = require("../controllers/artwork.controller");
const router = express.Router();
const { admin, auth, artist, requireRole } = require("../middleware/auth");
const multer = require("../middleware/multer");
const { cache } = require("../middleware/cache");

//récupérer toutes les oeuvres ✅
router.get("/", cache(300, 'artworks'), artworkController.getAllArtworks);

//Oeuvres en vente ✅
router.get("/forsale", cache(300, 'artworks'), artworkController.getForSaleArtworks);

router.get("/managed", auth, artworkController.getManagedArtworks);

//Oeuvre par id ✅
router.get("/one/:id", artworkController.getArtworkById);

//Oeuvres par catégorie ✅
router.get("/category/:category", artworkController.getArtworksByCategory);

//Oeuvres approuvées (admin, ajouter le middleware admin après les tests) ✅
router.get("/approved", admin, artworkController.getApprovedArtworks);

//Oeuvres approuvées (admin, ajouter le middleware admin après les tests) ✅
router.get("/pending", admin, artworkController.getPendingArtworks);

//Oeuvres approuvées (admin, ajouter le middleware admin après les tests) ✅
router.get("/rejected", admin, artworkController.getRejectedArtworks);

router.post("/", auth, multer, artworkController.createArtwork); //✅

router.get("/artist/:id", cache(300, 'artworks'), artworkController.getArtworksByArtistId); //✅

router.get(
  "/forsale/artist/:id",
  cache(300, 'artworks'),
  artworkController.getArtworksForSaleByArtistId
); //✅

router.get("/forsale/owner/:id", artworkController.getArtworksForSaleByOwnerId); //✅

router.put("/:id", auth, multer, artworkController.updateArtwork);

router.put("/status/:id", artworkController.updateArtworkStatus); //✅

router.put("/etherscan/:id", admin, artworkController.updateEtherscan);

router.get("/random", cache(120, 'artworks'), artworkController.getRandomArtworks);

router.get("/random/:category", artworkController.getRandomArtworksByCategory);

router.get("/purchase/:id", auth, artworkController.purchaseArtwork);

router.put("/update/:id", multer, artworkController.updateArtwork); //✅

// router.get("/populate", adartworkController.populateDtabase);
// router.delete("/depopulate", artworkController.dePopulateDatabase);

router.get("/liked", auth, artworkController.getLikedArtworks);
router.post("/like/:id", auth, artworkController.likeArtwork);
router.delete("/dislike/:id", auth, artworkController.dislikeArtwork);

// Standard Kucibok — vérification publique (sans auth, scannable via QR)
router.get("/verify/:kuciobkId", artworkController.verifyArtwork);

// F3 — Catalogue certifié (professionnel + admin uniquement)
router.get("/catalogue", requireRole('professional', 'admin'), artworkController.getCataloguePro);

router.delete("/:id", auth, artworkController.deleteArtwork);

module.exports = router;
