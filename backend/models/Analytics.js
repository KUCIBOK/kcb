const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Utilisateurs
    totalUsers: {
      type: Number,
      default: 0,
    },
    activeUsersToday: {
      type: Number,
      default: 0,
    },
    newUsersToday: {
      type: Number,
      default: 0,
    },
    usersByRole: {
      admin: { type: Number, default: 0 },
      artist: { type: Number, default: 0 },
      collector: { type: Number, default: 0 },
      professional: { type: Number, default: 0 },
    },
    
    // Œuvres d'art
    totalArtworks: {
      type: Number,
      default: 0,
    },
    pendingArtworks: {
      type: Number,
      default: 0,
    },
    approvedArtworks: {
      type: Number,
      default: 0,
    },
    rejectedArtworks: {
      type: Number,
      default: 0,
    },
    newArtworksToday: {
      type: Number,
      default: 0,
    },

    // Enchères
    activeAuctions: {
      type: Number,
      default: 0,
    },
    completedAuctions: {
      type: Number,
      default: 0,
    },
    totalBids: {
      type: Number,
      default: 0,
    },
    totalAuctionRevenue: {
      type: Number,
      default: 0,
    },

    // Transactions
    totalTransactions: {
      type: Number,
      default: 0,
    },
    successfulTransactions: {
      type: Number,
      default: 0,
    },
    failedTransactions: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    revenueToday: {
      type: Number,
      default: 0,
    },

    // Livraisons (Logidoo)
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    deliveriesInProgress: {
      type: Number,
      default: 0,
    },
    deliveriesCompleted: {
      type: Number,
      default: 0,
    },
    deliveriesFailed: {
      type: Number,
      default: 0,
    },
    deliverySuccessRate: {
      type: Number,
      default: 0,
    },

    // Support
    totalTickets: {
      type: Number,
      default: 0,
    },
    openTickets: {
      type: Number,
      default: 0,
    },
    resolvedTickets: {
      type: Number,
      default: 0,
    },
    avgResolutionTime: {
      type: Number,
      default: 0,
    },

    // Système
    dbStatus: {
      type: String,
      enum: ['connected', 'disconnected', 'error'],
      default: 'connected',
    },
    apiResponseTime: {
      type: Number,
      default: 0,
    },
    serverStatus: {
      type: String,
      enum: ['healthy', 'degraded', 'down'],
      default: 'healthy',
    },
    uptime: {
      type: Number,
      default: 0,
    },

    // Top données
    topArtists: [
      {
        artistId: mongoose.Schema.Types.ObjectId,
        name: String,
        artworksCount: Number,
        revenue: Number,
      },
    ],
    topCollectors: [
      {
        collectorId: mongoose.Schema.Types.ObjectId,
        name: String,
        purchasesCount: Number,
        totalSpent: Number,
      },
    ],
    mostViewedArtworks: [
      {
        artworkId: mongoose.Schema.Types.ObjectId,
        title: String,
        views: Number,
        bids: Number,
      },
    ],
  },
  { timestamps: true }
);

// Index pour les requêtes rapides
analyticsSchema.index({ date: -1 });
analyticsSchema.index({ createdAt: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
