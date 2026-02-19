const mongoose = require('mongoose')

const blogPostSchema = mongoose.Schema({
    title : {
        type : String,
        required: true,
        index : true
    },
    excerpt : {
        type : String
    },
    content : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    authorId : {
        type : String,
        required : true,
        index : true
    },
    publishDate : {
        type : Date,
        default : Date.now()
    },
    tags : [{
        type : String,
        lowercase: true,
        trim: true
    }],
    status : {
        type : String,
        enum : ['draft', 'published', 'archived'],
        default : "published"
    },
    visited : {
        type : Number,
        default : 0
    },
    comments : [
        {
            authorId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User',
                required : true,
                index : true
            },
            content : {
                type : String,
                required : true
            },
            createdAt : {
                type : Date,
                default : Date.now()
            }
        }
    ],
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('BlogPost', blogPostSchema)
