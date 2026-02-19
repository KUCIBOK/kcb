const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    artworkId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Artwork',
        index : true,
        required : true
    },
    professionalId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        index : true,
        unique : true,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        default : 0
    },
    technicalReview : {
        type : Number,
        default : 0
    },
    artisticMerit : {
        type : Number,
        default : 0
    },
    marketPotential : {
        type : Number,
        default : 0
    },
    createdAt : {
        type : Date,
        default : Date.now,
        index : true
    }
})

module.exports = mongoose.model('Review', reviewSchema)