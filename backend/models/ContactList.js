const mongoose = require("mongoose");

const contactListSchema = new mongoose.Schema({
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: String,

  // List type
  type: {
    type: String,
    enum: ['static', 'dynamic', 'event'],
    default: 'static'
  },

  // For dynamic lists - auto-update based on criteria
  criteria: {
    tags: [String],
    type: String, // 'collector', 'gallery', etc.
    status: String,
    customConditions: mongoose.Schema.Types.Mixed
  },

  // For event lists - RSVP tracking
  event: {
    name: String,
    date: Date,
    location: String,
    rsvpEnabled: { type: Boolean, default: false },
    rsvpDeadline: Date,
    capacity: Number,
  },

  // Statistics
  stats: {
    totalContacts: { type: Number, default: 0 },
    activeContacts: { type: Number, default: 0 },
    unsubscribed: { type: Number, default: 0 },
    campaignsSent: { type: Number, default: 0 },
    lastCampaignSent: Date,
  },

  // RSVP tracking for event lists
  rsvps: [{
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'maybe'],
      default: 'pending'
    },
    respondedAt: Date,
    guestsCount: { type: Number, default: 1 },
    notes: String
  }],

  // Settings
  settings: {
    allowDuplicates: { type: Boolean, default: false },
    autoCleanup: { type: Boolean, default: true }, // Remove bounced/unsubscribed
  },

  isArchived: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

contactListSchema.index({ professionalId: 1, type: 1 });
contactListSchema.index({ professionalId: 1, isArchived: 1 });

module.exports = mongoose.model('ContactList', contactListSchema);
