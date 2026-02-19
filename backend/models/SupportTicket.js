const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['paiement', 'livraison', 'artwork', 'compte', 'encheres', 'autre'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['basse', 'normale', 'haute', 'critique'],
      default: 'normale',
    },
    subject: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ouvert', 'en_cours', 'en_attente', 'resolu', 'ferme'],
      default: 'ouvert',
    },
    responses: [
      {
        responderType: {
          type: String,
          enum: ['admin', 'user'],
        },
        responderName: String,
        responderId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        message: String,
        attachments: [String],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
    },
    assignedToName: String,
    tags: [String],
    resolution: String,
    closedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Générer un ID de ticket unique
supportTicketSchema.pre('save', function(next) {
  if (!this.ticketId) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    this.ticketId = `TKT-${timestamp}-${randomNum}`;
  }
  next();
});

// Index pour les recherches rapides
supportTicketSchema.index({ status: 1, createdAt: -1 });
supportTicketSchema.index({ userId: 1 });
supportTicketSchema.index({ assignedTo: 1 });
supportTicketSchema.index({ priority: 1 });
supportTicketSchema.index({ ticketId: 1 });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
