const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  description: String,
  
  category: {
    type: String,
    enum: ['exhibition', 'newsletter', 'event', 'promotion', 'welcome', 'custom'],
    default: 'custom'
  },

  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Template structure with blocks
  content: {
    blocks: [
      {
        id: String,
        type: {
          type: String,
          enum: ['header', 'footer', 'text', 'image', 'button', 'divider', 'social', 'spacer']
        },
        content: mongoose.Schema.Types.Mixed,
        styles: mongoose.Schema.Types.Mixed,
        settings: mongoose.Schema.Types.Mixed,
      }
    ],
    theme: {
      primaryColor: String,
      backgroundColor: String,
      textColor: String,
      fontFamily: String,
    }
  },

  // Merge tags available
  mergeTags: [String],

  // Predefined or custom
  isDefault: {
    type: Boolean,
    default: false
  },

  isPublic: {
    type: Boolean,
    default: false
  },

  usageCount: {
    type: Number,
    default: 0
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

emailTemplateSchema.index({ professionalId: 1, category: 1 });
emailTemplateSchema.index({ professionalId: 1, isDefault: 1 });

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
