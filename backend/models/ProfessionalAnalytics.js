const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: true,
    },
    
    // Owner
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Analytics data
    data: {
      // KPIs
      conversionRate: Number,
      averageSaleTime: Number, // days
      totalViews: Number,
      totalFavorites: Number,
      viewsToSale: Number,
      
      // Sales by category
      salesByCategory: mongoose.Schema.Types.Mixed,
      
      // Sales by price range
      salesByPriceRange: mongoose.Schema.Types.Mixed,
      
      // Sales by period
      salesByPeriod: mongoose.Schema.Types.Mixed,
      
      // Top performing artworks
      topArtworks: mongoose.Schema.Types.Mixed,
      
      // Top artists
      topArtists: mongoose.Schema.Types.Mixed,
      
      // Traffic sources
      trafficSources: mongoose.Schema.Types.Mixed,
      
      // Geographic distribution
      geographicDistribution: mongoose.Schema.Types.Mixed,
    },

    // Metadata
    period: {
      type: String,
      enum: ["week", "month", "quarter", "year", "all"],
      default: "month",
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
analyticsSchema.index({ professionalId: 1, period: 1 });
analyticsSchema.index({ professionalId: 1, generatedAt: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
