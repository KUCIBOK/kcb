const express = require('express')
const router = express.Router()
const {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryStatus,
} = require('../controllers/sourcing.controller')
const { auth, admin } = require('../middleware/auth')

/**
 * Routes F3 — Catalogue Certifié / Sourcing B2B
 *
 * POST   /api/sourcing            — Créer une demande (tout utilisateur authentifié)
 * GET    /api/sourcing/mine       — Mes demandes (utilisateur connecté)
 * GET    /api/sourcing            — Toutes les demandes (admin)
 * PATCH  /api/sourcing/:id        — Mise à jour statut (admin)
 */

router.post('/', auth, createInquiry)
router.get('/mine', auth, getMyInquiries)
router.get('/', admin, getAllInquiries)
router.patch('/:id', admin, updateInquiryStatus)

module.exports = router
