const mongoose = require('mongoose');

const logidooAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['status_change', 'delivery_exception', 'delay', 'delivered', 'created', 'cancelled'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'critical', 'success'],
    default: 'info',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryRequest',
  },
  trackingId: {
    type: String,
  },
  previousStatus: String,
  newStatus: String,
  metadata: {
    location: String,
    estimatedDelivery: Date,
    details: mongoose.Schema.Types.Mixed,
  },
  read: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
}, { timestamps: true });

// Index pour requêtes rapides
logidooAlertSchema.index({ createdAt: -1 });
logidooAlertSchema.index({ read: 1, createdAt: -1 });
logidooAlertSchema.index({ type: 1, severity: 1 });

const LogidooAlert = mongoose.model('LogidooAlert', logidooAlertSchema);

module.exports = LogidooAlert;
