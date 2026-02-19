const Wallet = require('../models/Wallet');
const { createError } = require("../middleware/errorHandler");


// Créer un wallet
exports.createWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.create(req.body);
    res.status(201).json(wallet);
  } catch (err) {
    next(createError.badRequest(err.message));
  }
};

// Obtenir tous les wallets
exports.getAllWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.find().populate('userId transactions');
    res.status(200).json(wallets);
  } catch (err) {
    next(createError.internal(err.message));
  }
};

// Obtenir un wallet par ID
exports.getWalletById = async (req, res, next) => {
  try {
    const wallet = await Wallet.findById(req.params.id).populate('userId transactions');
    if (!wallet) return next(createError.notFound('Wallet non trouvé'));
    res.status(200).json(wallet);
  } catch (err) {
    next(createError.internal(err.message));
  }
};

// Mettre à jour un wallet
exports.updateWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!wallet) return next(createError.notFound('Wallet non trouvé'));
    res.status(200).json(wallet);
  } catch (err) {
    next(createError.badRequest(err.message));
  }
};

// Supprimer un wallet
exports.deleteWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findByIdAndDelete(req.params.id);
    if (!wallet) return next(createError.notFound('Wallet non trouvé'));
    res.status(200).json({ message: 'Wallet supprimé' });
  } catch (err) {
    next(createError.internal(err.message));
  }
};

exports.deleteAll = async (req, res, next) => {
    try {
        await Wallet.deleteMany({})
    } catch (error) {
        return next(createError.internal("Erreur lors de la suppression"));
    }
}