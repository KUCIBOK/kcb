const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByArtworkId,
} = require("../controllers/review.controller");
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Gestion des critiques d'œuvres
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Créer une critique
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Critique créée avec succès
 */
router.post("/", createReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Obtenir toutes les critiques
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Liste des critiques
 */
router.get("/", getAllReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Obtenir une critique par ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Critique trouvée
 *       404:
 *         description: Critique non trouvée
 */
router.get("/:id", getReviewById);

router.get("/artwork/:id", getReviewsByArtworkId);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Mettre à jour une critique
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Critique mise à jour
 */
router.put("/:id", updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Supprimer une critique
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Critique supprimée
 */
router.delete("/:id", deleteReview);

module.exports = router;
