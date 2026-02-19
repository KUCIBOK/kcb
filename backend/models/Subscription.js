const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  planRole : {type : String},
  planName : {type : String},
  amount : {type : Number},
  currency : {type : String},
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  nextPaymentDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired', 'cancelled', 'pending', 'failed'], default: 'pending' },
  paymentId: {type : String}
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);