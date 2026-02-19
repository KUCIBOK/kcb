const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true // Index for frequent lookups
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    privateKey: {
        type: String,
        // required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'ETH' // Default currency can be changed as needed
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction' // Assuming you have a Transaction model for transaction history
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Wallet', walletSchema);