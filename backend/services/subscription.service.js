const Subscription = require('../models/Subscription');

exports.expireSubscriptions = async function () {
  const now = new Date();
  await Subscription.updateMany(
    { endDate: { $lt: now }, status: 'active' },
    { $set: { status: 'expired' } }
  );
}