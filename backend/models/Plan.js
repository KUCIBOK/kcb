const mongoose = require('mongoose')

const planSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    currency : {
        type : String,
        required : true,
        default : 'XOF'
    },
    level : {
        type : Number,
        min : 1,
        max : 3
    },
    duration : {
        type : String,
        enum : ['monthly', 'yearly'],
        required : true
    },
    role : {
        type : String,
        enum : ['collector', 'professional', 'artist']
    },
    features : [{
        type : String
    }],
    isActive : {
        type : Boolean,
        default : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
}, {
    timestamps : true
})

module.exports = mongoose.model('Plan', planSchema)