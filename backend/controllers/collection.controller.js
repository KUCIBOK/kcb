const Collection = require('../models/Collection');
const Artwork = require('../models/Artwork')
const { createError } = require("../middleware/errorHandler");


// Créer une collection
exports.createCollection = async (req, res, next) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json(collection);
  } catch (err) {
    next(createError.badRequest(err.message));
  }
};

// Obtenir toutes les collections
exports.getAllCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find().populate('artworks');
    res.status(200).json(collections);
  } catch (err) {
    next(createError.internal(err.message));
  }
};

// Obtenir une collection par ID
exports.getCollectionById = async (req, res, next) => {
  try {
    const collection = await Collection.findOne({_id : req.params.id});
    if (!collection) return next(createError.notFound('Collection non trouvée'));
    res.status(200).json(collection);
  } catch (err) {
    next(createError.internal(err.message));
  }
};

// Mettre à jour une collection
exports.updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findOneAndUpdate({_id : req.params.id}, req.body, { new: true });
    if (!collection) return next(createError.notFound('Collection non trouvée'));
    res.status(200).json(collection);
  } catch (err) {
    next(createError.badRequest(err.message));
  }
};

// Supprimer une collection
exports.deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findOneAndDelete({_id : req.params.id});
    if (!collection) return next(createError.notFound('Collection non trouvée'));
    const artworks = await Artwork.deleteMany({collectionId : collection._id})
    res.status(200).json({ message: 'Collection supprimée' });
  } catch (err) {
    next(createError.internal(err.message));
  }
};


exports.deleteAll = async (req, res, next) => {
    try {
        await Collection.deleteMany({})
        res.status(200).json({ message: 'Toutes les collections ont été supprimées' });
    } catch (error) {
        return next(createError.internal("Erreur lors de la suppression"));
    }
}