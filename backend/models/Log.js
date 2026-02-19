const mongoose = require('mongoose')

const logSchema = mongoose.Schema({
    description : {
        type : String,
        required : [true, "Description du log requise"]
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})


module.exports = mongoose.model('Log', logSchema)