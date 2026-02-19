const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    title : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

// Virtual populate for artworks
categorySchema.virtual('artworks', {
  ref: 'Artwork',
  localField: '_id',
  foreignField: 'categoryId',
  justOne: false
});

module.exports = mongoose.model('Category', categorySchema)