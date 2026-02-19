const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const interactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["email", "call", "meeting", "purchase", "note"],
      required: true,
    },
    description: String,
    date: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  { _id: true }
);

const crmClientSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email invalide",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    country: String,
    city: String,
    address: String,

    // Professional relationship
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Status & Segmentation
    status: {
      type: String,
      enum: ["prospect", "client", "vip", "inactive"],
      default: "prospect",
      index: true,
    },

    segment: {
      type: String,
      enum: [
        "art-collector",
        "corporate",
        "museum",
        "gallery",
        "investor",
        "other",
      ],
      default: "other",
    },

    // Purchase history
    totalPurchases: {
      type: Number,
      default: 0,
      index: true,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    purchaseHistory: [
      {
        artworkId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Artwork",
        },
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
        title: String,
      },
    ],

    // Interactions & Follow-up
    interactions: [interactionSchema],

    lastInteraction: Date,

    nextFollowUp: Date,

    // Notes & Comments
    notes: [noteSchema],

    // Preferences
    interests: [String],

    preferences: {
      artCategories: [String],
      priceRange: {
        min: Number,
        max: Number,
      },
      preferredArtists: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Artist",
        },
      ],
      communicationPreference: {
        type: String,
        enum: ["email", "phone", "sms", "whatsapp"],
        default: "email",
      },
    },

    // Performance metrics
    engagementScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    conversionRate: {
      type: Number,
      default: 0,
    },

    // Tags for organization
    tags: [String],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

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

// Indexes for common queries
crmClientSchema.index({ professionalId: 1, status: 1 });
crmClientSchema.index({ professionalId: 1, segment: 1 });
crmClientSchema.index({ professionalId: 1, createdAt: -1 });
crmClientSchema.index({ email: 1, professionalId: 1 });

module.exports = mongoose.model("CrmClient", crmClientSchema);

