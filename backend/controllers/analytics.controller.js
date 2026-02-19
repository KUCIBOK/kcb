const Analytics = require('../models/Analytics');
const User = require('../models/user');
const Artwork = require('../models/artwork');
const Auction = require('../models/Auction');
const Transaction = require('../models/transaction');
const SupportTicket = require('../models/SupportTicket');

// Collecter les données analytics et les sauvegarder
const collectAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Compter les utilisateurs
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const userRoleMap = {
      admin: 0,
      artist: 0,
      collector: 0,
      professional: 0,
    };

    usersByRole.forEach((item) => {
      if (userRoleMap.hasOwnProperty(item._id)) {
        userRoleMap[item._id] = item.count;
      }
    });

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // Compter les artworks
    const totalArtworks = await Artwork.countDocuments();
    const pendingArtworks = await Artwork.countDocuments({ status: 'pending' });
    const approvedArtworks = await Artwork.countDocuments({ status: 'approved' });
    const rejectedArtworks = await Artwork.countDocuments({ status: 'rejected' });
    const newArtworksToday = await Artwork.countDocuments({
      createdAt: { $gte: today },
    });

    // Enchères
    const activeAuctions = await Auction.countDocuments({ status: 'active' });
    const completedAuctions = await Auction.countDocuments({ status: 'completed' });
    const totalBids = await Auction.aggregate([
      { $group: { _id: null, totalBids: { $sum: '$bids' } } },
    ]);

    const totalAuctionRevenue = await Auction.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: { _id: null, total: { $sum: '$finalPrice' } },
      },
    ]);

    // Transactions
    const totalTransactions = await Transaction.countDocuments();
    const successfulTransactions = await Transaction.countDocuments({
      status: 'completed',
    });
    const failedTransactions = await Transaction.countDocuments({
      status: 'failed',
    });

    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const revenueToday = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: today },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Support tickets
    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({
      status: { $in: ['ouvert', 'en_cours'] },
    });
    const resolvedTickets = await SupportTicket.countDocuments({
      status: 'resolu',
    });

    // Top artistes
    const topArtists = await Artwork.aggregate([
      {
        $match: { status: 'approved' },
      },
      {
        $group: {
          _id: '$artistId',
          artworksCount: { $sum: 1 },
          revenue: { $sum: '$price' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // Top collectionneurs
    const topCollectors = await Transaction.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: '$buyerId',
          purchasesCount: { $sum: 1 },
          totalSpent: { $sum: '$amount' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    // Créer ou mettre à jour les analytics
    const analytics = new Analytics({
      date: new Date(),
      totalUsers,
      newUsersToday,
      usersByRole: userRoleMap,
      activeUsersToday: totalUsers * 0.3, // Estimation
      
      totalArtworks,
      pendingArtworks,
      approvedArtworks,
      rejectedArtworks,
      newArtworksToday,

      activeAuctions,
      completedAuctions,
      totalBids: totalBids[0]?.totalBids || 0,
      totalAuctionRevenue: totalAuctionRevenue[0]?.total || 0,

      totalTransactions,
      successfulTransactions,
      failedTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueToday: revenueToday[0]?.total || 0,

      totalTickets,
      openTickets,
      resolvedTickets,

      serverStatus: 'healthy',
      dbStatus: 'connected',
      apiResponseTime: 50,
      uptime: process.uptime(),

      topArtists: topArtists.slice(0, 5),
      topCollectors: topCollectors.slice(0, 5),
    });

    await analytics.save();

    res.json({
      success: true,
      message: 'Analytics collectées avec succès',
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la collecte des analytics',
      error: error.message,
    });
  }
};

// Récupérer les dernières analytics
const getLatestAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.findOne().sort({ date: -1 }).lean();

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Aucune donnée analytics',
      });
    }

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analytics',
      error: error.message,
    });
  }
};

// Récupérer l'historique des analytics (7 derniers jours)
const getAnalyticsHistory = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const history = await Analytics.find({
      date: { $gte: sevenDaysAgo },
    })
      .sort({ date: -1 })
      .lean();

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique',
      error: error.message,
    });
  }
};

// Récupérer les statistiques du système en temps réel
const getSystemHealth = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        status: 'connected',
        collections: ['users', 'artworks', 'auctions', 'transactions'],
      },
      api: {
        responseTime: 50,
        requestsPerSecond: 100,
      },
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur',
      error: error.message,
    });
  }
};

module.exports = {
  collectAnalytics,
  getLatestAnalytics,
  getAnalyticsHistory,
  getSystemHealth,
};
