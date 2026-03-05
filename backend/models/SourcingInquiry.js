const mongoose = require('mongoose')

const sourcingInquirySchema = new mongoose.Schema({
  artworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true,
    index: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Organisation de l'acheteur / curateur
  organization: {
    type: String,
    trim: true,
  },
  purpose: {
    type: String,
    enum: ['exhibition', 'acquisition', 'loan', 'expertise', 'other'],
    required: true,
  },
  budget: {
    type: String, // "Sur demande" ou fourchette ex: "€5 000 – €10 000"
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  // Suivi admin
  status: {
    type: String,
    enum: ['pending', 'contacted', 'closed'],
    default: 'pending',
    index: true,
  },
  adminNote: {
    type: String,
  },
}, { timestamps: true })

sourcingInquirySchema.index({ artworkId: 1, requestedBy: 1 })

module.exports = mongoose.model('SourcingInquiry', sourcingInquirySchema)
