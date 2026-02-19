const mongoose = require("mongoose");

const entitySchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: String,

    type: {
      type: String,
      enum: ["gallery", "studio", "collective", "marketplace", "other"],
      default: "gallery",
    },

    // Owner/Manager
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Branding
    logo: String,
    coverImage: String,
    website: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
      linkedin: String,
    },

    // Contact info
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: String,

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },

    // Settings
    currency: {
      type: String,
      default: "XOF",
    },

    timezone: {
      type: String,
      default: "Africa/Dakar",
    },

    language: {
      type: String,
      enum: ["fr", "en"],
      default: "fr",
    },

    // Permissions & Access
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "manager", "artist", "viewer"],
          default: "artist",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Metadata
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
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

// Indexes
entitySchema.index({ owner: 1, isActive: 1 });
entitySchema.index({ owner: 1, createdAt: -1 });
entitySchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Entity", entitySchema);
