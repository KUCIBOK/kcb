const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Contact info
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  phone: String,
  company: String,
  
  // Segmentation
  tags: [String],
  
  type: {
    type: String,
    enum: ['collector', 'gallery', 'artist', 'press', 'other'],
    default: 'collector'
  },

  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced', 'spam'],
    default: 'active'
  },

  // Custom fields
  customFields: mongoose.Schema.Types.Mixed,

  // Engagement metrics
  stats: {
    emailsSent: { type: Number, default: 0 },
    emailsOpened: { type: Number, default: 0 },
    emailsClicked: { type: Number, default: 0 },
    lastEmailSent: Date,
    lastEmailOpened: Date,
    lastEmailClicked: Date,
  },

  // GDPR compliance
  consent: {
    marketing: { type: Boolean, default: false },
    grantedAt: Date,
    source: String, // 'manual', 'signup', 'import'
  },

  unsubscribedAt: Date,
  unsubscribeReason: String,

  // Lists membership (will be in ContactList model)
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContactList'
  }],

  // Source
  source: {
    type: String,
    enum: ['manual', 'import', 'signup', 'event', 'crm'],
    default: 'manual'
  },

  notes: String,

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

// Indexes for performance
contactSchema.index({ professionalId: 1, email: 1 }, { unique: true });
contactSchema.index({ professionalId: 1, status: 1 });
contactSchema.index({ professionalId: 1, type: 1 });
contactSchema.index({ tags: 1 });

module.exports = mongoose.model('Contact', contactSchema);
