const mongoose = require('mongoose')

const NumerisationRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    artworkCount: {
        type: Number,
        required: [true, 'Le nombre d\'oeuvres est requis'],
        min: [1, 'Le nombre d\'oeuvres doit être au moins 1']
    },
    address: {
        type: String,
        required: [true, 'L\'adresse est requise']
    },
    telephone: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
        // validate: {
        //     validator: function(v) {
        //         return /\+?[0-9]{10,15}/.test(v); // Validation simple pour un numéro de téléphone
        //     },
        //     message: props => `${props.value} n'est pas un numéro de téléphone valide!`
        // }
    },
    description: {
        type: String,
        required: [true, 'La description est requise'],
        minlength: [10, 'La description doit contenir au moins 10 caractères']
    },
    price: {
        type: Number,
    },
    currency: {
        type: String,
        enum: ['XOF', 'USD', 'EUR'],
        default: 'XOF'
    },
    category: {
        type: String,
        required: [true, 'La catégorie est requise']
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'L\'ID de la catégorie est requis']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    comingDate : {
        type: Date,
    },
    reason: {
        type: String,
        default: ''
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('NumerisationRequest', NumerisationRequestSchema)
