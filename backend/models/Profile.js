const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    name : {
        type : String,
    },
    username : {
        type : String,
        required : true
    },
    country : {
        type : String,
    },

    //Collector
    interests : {
        type : String,
    },

    //Professional
    institution : {
        type : String,
    },
    qualifications : {
        type : String,
    },

    //Common
    image : {
        type : String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Profile', profileSchema);