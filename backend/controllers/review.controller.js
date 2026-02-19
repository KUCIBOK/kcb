const Review = require('../models/Review');
const { createError } = require("../middleware/errorHandler");


// Créer une review
exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    next(createError.badRequest(err.message));
  }
};

// Obtenir toutes les reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    next(createError.internal(err.message));
  }
};

exports.getReviewsByArtworkId = async (req, res, next) => {
  try {
    const reviews = await Review.find({ artworkId: req.params.id });
    if (!reviews) return next(createError.notFound('Aucune review trouvée pour cette oeuvre'));
    res.status(200).json(reviews);
  } catch (err) {
    next(createError.internal(err.message));
  }
}

// Obtenir une review par ID
exports.getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(createError.notFound('Review non trouvée'));
    res.status(200).json(review);
  } catch (err) {
    next(createError.internal(err.message));
  }
};

// Mettre à jour une review
exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return next(createError.notFound('Review non trouvée'));
    res.status(200).json(review);
  } catch (err) {
    next(createError.badRequest(err.message));
  }
};

// Supprimer une review
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return next(createError.notFound('Review non trouvée'));
    res.status(200).json({ message: 'Review supprimée' });
  } catch (err) {
    next(createError.internal(err.message));
  }
};

exports.deleteAll = async (req, res, next) => {
    try {
        await Review.deleteMany({})
    } catch (error) {
        return next(createError.internal("Erreur lors de la suppression"));
    }
}