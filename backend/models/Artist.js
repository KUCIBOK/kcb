const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Index for frequent lookups
    },
    name : {
        type : String,
    },
    username : {
        type : String,
    },
    country : {
        type : String,
    },
    biography : {
        type : String,
    },
    portfolio : {
        type : String
    },
    image : {
        type : String,
    },
    socials : {
        instagram : {type : String},
        twitter : {type : String},
        facebook : {type : String},
        linkedin : {type : String}
    },
    artistSheet : {
        type : String
    },
    visited : {
        type : Number,
        default : 0
    },
    featured: {
        type: Boolean,
        default: false,
        index: true // Index for filtering featured artists
    },
    artworkCount : {
        type : Number,
        default : 0
    },
    totalSales : {
        type : Number,
        default : 0
    },
    totalEarnings : {
        type : Number,
        default : 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Virtual populate for artworks
artistSchema.virtual('artworks', {
  ref: 'Artwork',
  localField: '_id',
  foreignField: 'artistId',
  justOne: false
});

// Compound index for searching and filtering
artistSchema.index({ name: 'text', country: 'text', biography: 'text' });

module.exports = mongoose.model('Artist', artistSchema);
