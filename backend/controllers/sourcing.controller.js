const SourcingInquiry = require('../models/SourcingInquiry')
const Artwork = require('../models/Artwork')
const User = require('../models/User')
const { createError } = require('../middleware/errorHandler')
const logger = require('../utils/logger')
const { sendAlertMail } = require('../services/mailer.service')
const { config } = require('../config/environnement')

const PURPOSE_LABELS = {
  exhibition:  'Exposition',
  acquisition: 'Acquisition',
  loan:        'Prêt temporaire',
  expertise:   'Expertise',
  other:       'Autre',
}

// POST /api/sourcing  — Créer une demande de mise en relation
exports.createInquiry = async (req, res, next) => {
  try {
    const { artworkId, organization, purpose, budget, message } = req.body

    if (!artworkId || !purpose || !message) {
      return next(createError.badRequest('artworkId, purpose et message sont requis.'))
    }

    const artwork = await Artwork.findById(artworkId).lean()
    if (!artwork) return next(createError.notFound('Œuvre introuvable.'))
    if (artwork.status !== 'approved') {
      return next(createError.forbidden('Cette œuvre n\'est pas disponible au sourcing.'))
    }

    const inquiry = await SourcingInquiry.create({
      artworkId,
      requestedBy: req.user._id,
      organization: organization || '',
      purpose,
      budget: budget || 'Sur demande',
      message,
    })

    // Notification admin
    try {
      const requester = await User.findById(req.user._id).select('name email').lean()
      await sendAlertMail(
        config.alertReceiver || config.mailer?.from || 'admin@kucibok.com',
        `[F3] Nouvelle demande de sourcing — ${artwork.title}`,
        `<p><strong>${requester?.name || req.user._id}</strong> (${requester?.email}) a soumis une demande de sourcing.</p>
         <ul>
           <li><strong>Œuvre :</strong> ${artwork.title} — ${artwork.artist}</li>
           <li><strong>Objet :</strong> ${PURPOSE_LABELS[purpose] || purpose}</li>
           <li><strong>Organisation :</strong> ${organization || '—'}</li>
           <li><strong>Budget :</strong> ${budget || 'Sur demande'}</li>
           <li><strong>Message :</strong> ${message}</li>
         </ul>
         <p><a href="${config.cors.origin}/dashboard/admin">Voir dans l'admin</a></p>`
      )
    } catch (err) {
      logger.error('Erreur envoi mail sourcing', { message: err.message })
    }

    return res.status(201).json(inquiry)
  } catch (error) {
    return next(createError.internal(error.message))
  }
}

// GET /api/sourcing/mine  — Mes demandes (curateur connecté)
exports.getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await SourcingInquiry.find({ requestedBy: req.user._id })
      .populate('artworkId', 'title artist image kuciobkId availabilityStatus')
      .sort({ createdAt: -1 })
      .lean()
    return res.status(200).json(inquiries)
  } catch (error) {
    return next(createError.internal(error.message))
  }
}

// GET /api/sourcing  — Toutes les demandes (admin)
exports.getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await SourcingInquiry.find()
      .populate('artworkId', 'title artist image kuciobkId')
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean()
    return res.status(200).json(inquiries)
  } catch (error) {
    return next(createError.internal(error.message))
  }
}

// PATCH /api/sourcing/:id  — Mettre à jour le statut (admin)
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body
    const inquiry = await SourcingInquiry.findById(req.params.id)
    if (!inquiry) return next(createError.notFound('Demande introuvable.'))

    if (status) inquiry.status = status
    if (adminNote !== undefined) inquiry.adminNote = adminNote
    await inquiry.save()

    return res.status(200).json(inquiry)
  } catch (error) {
    return next(createError.internal(error.message))
  }
}
