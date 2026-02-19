const Subscription = require('../models/Subscription');

module.exports = async (req, res, next) => {
  const userId = req.user._id;
  const subscription = await Subscription.findOne({ userId, status: 'active', endDate: { $gte: new Date() } });
  if (!subscription) return res.status(403).json({ error: 'Abonnement requis' });
  next();
};