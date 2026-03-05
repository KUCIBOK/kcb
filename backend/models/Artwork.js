const mongoose = require("mongoose");
const { randomBytes } = require("crypto");

/**
 * Génère un identifiant Kucibok unique : KCB-XXXXXXXX (8 chars hex majuscules)
 */
function generateKuciobkId() {
  return "KCB-" + randomBytes(4).toString("hex").toUpperCase();
}

const artworkSchema = mongoose.Schema(
  {
    kuciobkId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      // required: true,
      index: true, // Index for frequent lookups
    },
    artist: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
      index: true, // Index for frequent lookups
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true, // Index for frequent lookups
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      index: true,
    },
    image: {
      type: String,
      // required : true
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      index: true,
    },
    medium: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      enum: ["excellent", "very_good", "good", "fair"],
    },
    provenance: {
      type: String,
      trim: true,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    price: {
      type: Number,
      // required: [true, 'Please add a price'],
      min: 0,
    },
    currency: {
      type: String,
      default: "XOF",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: String,
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    created: {
      type: Date,
      default: Date.now,
      index: true, // For sorting by creation date
    },
    etherscan: {
      type: String,
    },
    forSale: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    soldAt: {
      type: Date,
      index: true,
    },
    soldPrice: {
      type: Number,
      min: 0,
    },
    soldCurrency: {
      type: String,
      default: "XOF",
    },
    deliveryDetails: {
      type: String,
      default: "",
    },
    isDelivered: {
      type: String,
      enum: ["pending", "delivered", "on-the-way", "not-delivered"],
    },

    forBid: {
      type: Boolean,
      default: false,
    },

    auctionStatus: {
      type: String,
      enum: ["not_for_auction", "auction_ongoing", "sold_via_auction"],
      default: "not_for_auction",
    },

    edition: {
      number: {
        type: Number,
        default: 1,
      },
      total: {
        type: Number,
        default: 1,
      },
    },
    featured: {
      type: Boolean,
      default: false,
      index: true, // Index for filtering featured artworks
    },
    visited: {
      type: Number,
      default: 0,
    },
    certificatePath: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sold"],
      default: "pending",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    likesCount : {
      type : Number,
      default : 0
    },
    // F3 — Catalogue certifié
    availabilityStatus: {
      type: String,
      enum: ['available', 'on_exhibition', 'unavailable', 'on_request'],
      default: 'available',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for reviews
artworkSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "artworkId",
  justOne: false,
});

artworkSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "artworkId",
  justOne: false,
});

// Auto-générer le kuciobkId si absent (nouveaux documents + migration)
artworkSchema.pre("save", async function (next) {
  if (!this.kuciobkId) {
    let id;
    let exists = true;
    while (exists) {
      id = generateKuciobkId();
      exists = await mongoose.model("Artwork").exists({ kuciobkId: id });
    }
    this.kuciobkId = id;
  }
  next();
});

// Text index for search functionality
artworkSchema.index({ title: "text", description: "text", tags: "text" });

// Compound indexes for common queries
artworkSchema.index({ status: 1, featured: 1 });
artworkSchema.index({ price: 1 }); // For price range queries

module.exports = mongoose.model("Artwork", artworkSchema);
