const mongoose = require('mongoose')


const collectionSchema = mongoose.Schema({
    title : {
      type : String,
      required : true,
      index : true
    },
    description : {
      type : String,
      default : ''
    },
    tags : [{
      type : String,
      lowercase: true,
      trim: true
    }],
    artist : {
      type : String,
      required : true
    },
    artistId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Artist',
      index : true
    },
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User',
      index : true
    },
    artworkCount : {
      type : Number,
      default : 0
    }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for Artworks
collectionSchema.virtual('artworks', {
  ref: 'Artwork',
  localField: '_id',
  foreignField: 'collectionId',
  justOne: false
});

module.exports = mongoose.model('Collection', collectionSchema)