const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
    artworkId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Artwork',
        required : true,
        index : true
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        // required : true,
        index : true
    },
    buyerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        index : true
    },
    amount : {
        type : Number,
        required : true
    },
    currency: {
        type: String,
        required: true
    },
    method: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true
    },
    transactionId: {
        type: String,
        unique: true,
        sparse: true // Allow null values in unique field
    },
      platformFee: {
        type: Number,
        default: 0
    },
      createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
  timestamps: true
});

// Create composite indexes for common queries
transactionSchema.index({ sellerId: 1, createdAt: -1 });
transactionSchema.index({ buyerId: 1, createdAt: -1 });
transactionSchema.index({ paymentStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
