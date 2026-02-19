const cron = require('node-cron');
const Analytics = require('../models/Analytics');
const User = require('../models/user');
const Artwork = require('../models/artwork');
const Auction = require('../models/Auction');
const Transaction = require('../models/transaction');
const SupportTicket = require('../models/SupportTicket');

// Lancer le job toutes les heures
cron.schedule('0 * * * *', async () => {
  try {
    console.log('📊 Collecte automatique des analytics...');
    
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

    // Compter les artworks
    const totalArtworks = await Artwork.countDocuments();
    const pendingArtworks = await Artwork.countDocuments({ status: 'pending' });
    const approvedArtworks = await Artwork.countDocuments({ status: 'approved' });
    const rejectedArtworks = await Artwork.countDocuments({ status: 'rejected' });

    // Enchères
    const activeAuctions = await Auction.countDocuments({ status: 'active' });
    const completedAuctions = await Auction.countDocuments({ status: 'completed' });

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

    // Support
    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({
      status: { $in: ['ouvert', 'en_cours'] },
    });

    // Créer les analytics
    const analytics = new Analytics({
      date: new Date(),
      totalUsers,
      usersByRole: userRoleMap,
      
      totalArtworks,
      pendingArtworks,
      approvedArtworks,
      rejectedArtworks,

      activeAuctions,
      completedAuctions,

      totalTransactions,
      successfulTransactions,
      failedTransactions,
      totalRevenue: totalRevenue[0]?.total || 0,

      totalTickets,
      openTickets,

      serverStatus: 'healthy',
      dbStatus: 'connected',
      apiResponseTime: 50,
      uptime: process.uptime(),
    });

    await analytics.save();
    console.log('✅ Analytics collectées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la collecte des analytics:', error.message);
  }
});

console.log('📊 Job de collecte des analytics initialisé (toutes les heures)');
