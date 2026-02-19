const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    visitDate: { type: Date, default: Date.now },
    pageVisited: { type: String, required: true },
    referrer: { type: String },
    sessionId: { type: String, required: true },
    visitTime: { type: Number, default: 0 } // in seconds
}, {
    timestamps: true
});

module.exports = mongoose.model('Visitor', visitorSchema);
// This schema is used to track visitor information for analytics purposes.