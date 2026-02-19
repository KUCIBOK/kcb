const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
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

  // Email content
  draftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailDraft'
  },

  subject: {
    type: String,
    required: true,
  },

  preheader: String,

  content: {
    blocks: [mongoose.Schema.Types.Mixed],
    theme: mongoose.Schema.Types.Mixed
  },

  // Recipients
  recipients: {
    // From contact lists
    lists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContactList'
    }],
    
    // From CRM contacts
    crmContacts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CRMContact'
    }],
    
    // Manual emails
    emails: [String],
    
    // Segmentation filters
    filters: {
      status: String,
      type: String,
      tags: [String],
      customConditions: mongoose.Schema.Types.Mixed
    },

    totalCount: Number,
  },

  // Campaign status
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled'],
    default: 'draft'
  },

  // Scheduling
  scheduledAt: Date,
  sentAt: Date,

  // Test send
  testEmails: [String],
  testSentAt: Date,

  // Delivery tracking
  delivery: {
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    errors: [
      {
        email: String,
        error: String,
        timestamp: Date
      }
    ]
  },

  // Engagement tracking
  analytics: {
    opens: { type: Number, default: 0 },
    uniqueOpens: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    uniqueClicks: { type: Number, default: 0 },
    unsubscribes: { type: Number, default: 0 },
    spam: { type: Number, default: 0 },
    
    // Track individual recipient actions
    recipients: [
      {
        contactId: mongoose.Schema.Types.ObjectId,
        email: String,
        status: {
          type: String,
          enum: ['sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'spam'],
          default: 'sent'
        },
        sentAt: Date,
        deliveredAt: Date,
        openedAt: [Date],
        clickedAt: [Date],
        clickedLinks: [String],
        unsubscribedAt: Date,
        bouncedAt: Date,
      }
    ]
  },

  // Settings
  settings: {
    trackOpens: { type: Boolean, default: true },
    trackClicks: { type: Boolean, default: true },
    unsubscribeLink: { type: Boolean, default: true },
    sendTimeOptimization: { type: Boolean, default: false },
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

campaignSchema.index({ professionalId: 1, status: 1 });
campaignSchema.index({ professionalId: 1, sentAt: -1 });
campaignSchema.index({ 'analytics.recipients.contactId': 1 });
campaignSchema.index({ 'analytics.recipients.email': 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
