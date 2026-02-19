const mongoose = require("mongoose");

const integrationSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: true,
      enum: [
        "logidoo",
        "gmail",
        "outlook",
        "brevo",
        "google_calendar",
        "zoom",
        "instagram",
        "facebook",
        "twitter",
        "tiktok",
        "webhook",
      ],
      index: true,
    },

    // Owner
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Connection status
    isConnected: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Credentials (encrypted in production)
    credentials: {
      apiKey: String,
      apiSecret: String,
      accessToken: String,
      refreshToken: String,
      email: String,
      password: String, // Never store plaintext in production
      webhookUrl: String,
      webhookSecret: String,
      customFields: mongoose.Schema.Types.Mixed,
    },

    // Integration-specific settings
    settings: {
      // Logidoo
      autoSync: {
        type: Boolean,
        default: false,
      },
      syncInterval: {
        type: Number, // minutes
        default: 30,
      },
      enableAlerts: {
        type: Boolean,
        default: true,
      },

      // Email
      emailProvider: String,
      inboxLabel: String,
      autoReply: {
        type: Boolean,
        default: false,
      },
      autoReplyMessage: String,

      // Calendar
      calendarId: String,
      syncEventTypes: [String],
      eventNotifications: {
        type: Boolean,
        default: true,
      },

      // Social Media
      postToFeed: {
        type: Boolean,
        default: false,
      },
      hashtags: [String],
      engagementNotifications: {
        type: Boolean,
        default: true,
      },

      // Webhooks
      events: [
        {
          event: String,
          active: Boolean,
          retryAttempts: {
            type: Number,
            default: 3,
          },
        },
      ],
    },

    // Stats
    lastSync: Date,
    syncStatus: {
      type: String,
      enum: ["idle", "syncing", "error", "success"],
      default: "idle",
    },
    syncErrorMessage: String,
    totalSyncs: {
      type: Number,
      default: 0,
    },

    // Metadata
    connectedAt: {
      type: Date,
      default: Date.now,
    },

    disconnectedAt: Date,

    metadata: mongoose.Schema.Types.Mixed,

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
integrationSchema.index({ professionalId: 1, name: 1 });
integrationSchema.index({ professionalId: 1, isConnected: 1 });
integrationSchema.index({ name: 1, isConnected: 1 });

module.exports = mongoose.model("Integration", integrationSchema);
