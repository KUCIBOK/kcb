const mongoose = require('mongoose')

const deliveryRequest = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_preparation', 'on_the_way', 'delivered', 'rejected'],
        default: 'pending'
    },
    artworkIds : [{type : mongoose.Schema.Types.ObjectId, ref: 'Artwork'}],
    price : {
        type : Number
    },
    currency: {
        type: String,
        enum: ['XOF', 'USD', 'EUR'],
        default: 'XOF'
    },
    deliveryAddress : {
        type : String,
        required: true
    },
    deliveryDate : {
        type : Date,
        required : true,
    },
    collectDate : {
        type : Date,
        required : true
    },
    deliveryTime : {
        type : String
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientPhone: {
        type: String,
        required: true
    },
    specialInstructions: {
        type: String
    },
    trackingId: {
        type: String
    },
    estimatedDeliveryTime: {
        type: Number // in minutes
    },
    deliveryNotes: {
        type: String
    },
    insuranceRequired: {
        type: Boolean,
        default: false
    },
    packageSize: {
        type: String,
        enum: ['small', 'medium', 'large', 'extra_large']
    },
    packageWeight: {
        type: Number // in kg
    },
    deliveryPriority: {
        type: String,
        enum: ['standard', 'express', 'priority'],
        default: 'standard'
    },
    reason : {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('DeliveryRequest', deliveryRequest)