const Artwork = require("../models/Artwork");
const Artist = require("../models/Artist");
const User = require("../models/User");
const logger = require("../utils/logger");
const artworksData = require("../data/artworks");
const Transaction = require("../models/Transaction");
const {
  sendArtworkSubmissionAlertToAdmin,
  sendArtworkValidationEmail,
  sendArtworkRejectionEmail,
  sendArtworkPurchaseEmailToUser,
  sendArtworkPurchaseEmailToAdmin,
} = require("../services/mailer.service");
const {createError} = require("../middleware/errorHandler");
const { invalidateCache } = require("../middleware/cache");

exports.createArtwork = async (req, res, next) => {
  try {
    if (!req.file) {
      next(createError.badRequest("Aucune image trouvée"));
    }
    if (!req.body.artistId) {
      next(createError.notFound("Aucun artiste trouvé"));
    }
    const artwork = new Artwork({
      ...req.body,
      image: req.file.cloudinaryUrl,
      status: "pending",
      tags: req.body.tags.split(","),
      createdAt: new Date(),
    });

    try {
      await sendArtworkSubmissionAlertToAdmin(artwork);
    } catch (error) {
      logger.error(
        "Erreur lors de l'envoi de l'email de soumission d'œuvre:",
        error
      );
    }
    await artwork.save();
    await invalidateCache('artworks');
    return res.status(201).json(artwork);
  } catch (error) {
    next(error);
  }
};

exports.getAllArtworks = async (req, res, next) => {
  try {
    const artworks = await Artwork.find();

    if (artworks?.length > 0) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getForSaleArtworks = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({
      forSale: true,
      status: "approved",
    });
    if (artworks?.length > 0) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getArtworkById = async (req, res, next) => {
  try {
    const artwork = await Artwork.findOne({
      _id: req.params.id,
    });
    if (artwork?._id) {
      artwork.visited += 1;
      await artwork.save();
      return res.json(artwork);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getArtworksByCategory = async (req, res, next) => {
  const { category } = req.params;
  if (category != "") {
    try {
      const artworks = await Artwork.find({
        category: category,
      });
      if (artworks?.length >= 1) {
        return res.status(200).json(artworks);
      }
      next(createError.notFound("Aucune oeuvre trouvée"));
    } catch (error) {
      next(error);
    }
  }
  next(createError.badRequest("Catégorie invalide"));
};

exports.getPendingArtworks = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({
      status: "pending",
    });
    if (artworks?.length >= 1) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getApprovedArtworks = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({
      status: "approved",
    });
    if (artworks?.length >= 1) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getRejectedArtworks = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({
      status: "rejected",
    });
    if (artworks?.length >= 1) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getArtworksByArtistId = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({
      artistId: req.params.id,
    });
    if (artworks?.length >= 1) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getArtworksForSaleByArtistId = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({
      artistId: req.params.id,
      // forSale: true,
      status: "approved",
    });
    if (artworks?.length >= 1) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getArtworksForSaleByOwnerId = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({
      ownerId: req.params.id,
      forSale: true,
      status: "approved",
    });
    if (artworks?.length >= 1) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.updateArtworkStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const artwork = await Artwork.findOne({
      _id: req.params.id,
    });
    if (!artwork?._id)
      return next(createError.notFound("Aucune oeuvre trouvée"));

    artwork.status = status;
    const artist = await Artist.findOne({ _id: artwork.artistId });
    if (!artist?._id)
      return next(createError.notFound("Artiste non trouvé"));

    const user = await User.findOne({ _id: artwork.userId });
    if (status === "approved") {
      try {
        await sendArtworkValidationEmail(user?.email, artwork);
      } catch (error) {
        logger.error(
          "Erreur lors de l'envoi de l'email de validation d'œuvre:",
          error
        );
      }
    }
    if (status === "rejected") {
      artwork.forSale = false;
      try {
        await sendArtworkRejectionEmail(
          user?.email,
          artwork,
          "Votre œuvre a été rejetée."
        );
      } catch (error) {
        logger.error(
          "Erreur lors de l'envoi de l'email de rejet d'œuvre:",
          error
        );
      }
    }
    await artwork.save();
    const artistArtworks = await Artwork.find({
      artistId: artist?._id,
      status: "approved",
    });
    artist.artworkCount = artistArtworks?.length;
    await artist.save();
    return res.status(200).json(artwork);
  } catch (error) {
    next(error);
  }
};

exports.updateArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findOne({ _id: req.params.id });
    if (!artwork?._id) {
      return next(createError.notFound("Aucune oeuvre trouvée"));
    }
    if (req.body.title) artwork.title = req.body.title;
    if (req.body.description) artwork.description = req.body.description;
    if (req.body.height) artwork.height = req.body.height;
    if (req.body.width) artwork.width = req.body.width;
    if (req.body.weight) artwork.weight = req.body.weight;
    if (req.body.price) artwork.price = req.body.price;
    if (req.file) artwork.image = req.file.cloudinaryUrl;
    if (req.body.forSale) artwork.forSale = req.body.forSale;
    if (req.body.category) artwork.category = req.body.category;
    if (req.body.categoryId) artwork.categoryId = req.body.categoryId;
    if (req.body.artist) artwork.artist = req.body.artist;

    await artwork.save();
    await invalidateCache('artworks');
    return res.status(200).json(artwork);
  } catch (error) {
    next(error);
  }
};

exports.getManagedArtworks = async (req, res, next) => {
  try {
    const artworks = await Artwork.find({ userId: req.user._id });
    if (artworks?.length > 0) {
      return res.json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.updateEtherscan = async (req, res, next) => {
  try {
    const artwork = await Artwork.findOne({ _id: req.params.id });
    if (!artwork)
      return next(createError.notFound("Aucune oeuvre trouvée"));
    artwork.etherscan = req.body.etherscan;
    await artwork.save();
    return res.json(artwork);
  } catch (error) {
    next(error);
  }
};

exports.deleteArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findOneAndDelete({
      _id: req.params.id,
    });
    if (artwork?._id) {
      const artist = await Artist.findOne({
        id: artwork.artistId,
      });
      if (artist?._id) {
        artist.artworkCount = artist.artworkCount - 1;
        await artist.save();
      }
      await invalidateCache('artworks');
      return res.status(200).json({
        message: "Oeuvre supprimée avec succès",
      });
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.purchaseArtwork = async function (req, res, next) {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      status: "pending",
    });
    if (!transaction?._id)
      return next(createError.notFound("Aucune trace de tentative de paiement."));

    const artwork = await Artwork.findOne({
      _id: transaction?.artworkId,
      forSale: true,
    });
    if (!artwork?._id)
      return next(createError.notFound("L'oeuvre que vous essayez d'acheter est introuvable."));

    artwork.ownerId = transaction?.buyerId;
    artwork.forSale = false;
    artwork.sold = true;
    artwork.soldAt = Date.now();
    artwork.soldPrice = transaction?.amount;
    artwork.isDelivered = "pending";
    await artwork.save();

    transaction.paymentStatus = "completed";
    await transaction.save();
    const user = await User.findOne({ _id: transaction?.buyerId });
    const seller = await User.findOne({ _id: artwork?.userId });
    const buyer = await User.findOne({ _id: transaction?.buyerId });
    try {
      await sendArtworkPurchaseEmailToUser(
        user?.email,
        artwork,
        transaction,
        seller,
        buyer
      );
      await sendArtworkPurchaseEmailToAdmin(artwork, transaction, user);
    } catch (error) {
      logger.error(
        "Erreur lors de l'envoi de l'email d'achat d'œuvre:",
        error
      );
    }
    return res.status(200).json({ transaction, artwork });
  } catch (error) {
    next(error);
  }
};

// 🔹 Récupérer toutes les œuvres likées par l'utilisateur connecté
exports.getLikedArtworks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("likedArtworks");

    if (!user || !user.likedArtworks || user.likedArtworks.length === 0) {
      return next(createError.notFound("Aucune œuvre likée pour le moment"));
    }

    return res.status(200).json(user.likedArtworks);
  } catch (error) {
    next(error);
  }
};

// 🔹 Liker une œuvre
exports.likeArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return next(createError.notFound("Œuvre non trouvée"));
    }

    const user = await User.findById(req.user._id);

    // Vérifie si déjà likée
    if (user.likedArtworks.includes(artwork._id)) {
      return next(createError.conflict("Œuvre déjà likée"));
    }

    // Mise à jour
    artwork.likesCount += 1;
    user.likedArtworks.push(artwork._id);

    await artwork.save();
    await user.save();

    return res.status(200).json({
      message: "Œuvre likée avec succès",
      artwork,
      likedArtworks: user.likedArtworks,
    });
  } catch (error) {
    next(error);
  }
};

// 🔹 Disliker une œuvre
exports.dislikeArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return next(createError.notFound("Œuvre non trouvée"));
    }

    const user = await User.findById(req.user._id);

    // Vérifie si l'œuvre n'est pas déjà dislikée
    if (!user.likedArtworks.includes(artwork._id)) {
      return next(createError.badRequest("Œuvre non présente dans les likes"));
    }

    // Mise à jour
    artwork.likesCount = Math.max(0, artwork.likesCount - 1); // sécurité
    user.likedArtworks = user.likedArtworks.filter(
      (id) => id.toString() !== artwork._id.toString()
    );

    await artwork.save();
    await user.save();

    return res.status(200).json({
      message: "Œuvre dislikée avec succès",
      artwork,
      likedArtworks: user.likedArtworks,
    });
  } catch (error) {
    next(error);
  }
};

exports.populateDatabase = async (req, res, next) => {
  try {
    await Artwork.insertMany(artworksData);
    res.status(201).json({ message: "Database successfully populated with artworks." });
  } catch (error) {
    next(error);
  }
};

exports.dePopulateDatabase = async (req, res, next) => {
  try {
    await Artwork.deleteMany();
    res.status(201).json({ message: "Database successfully depopulated" });
  } catch (error) {
    next(error);
  }
};

exports.getRandomArtworks = async (req, res, next) => {
  try {
    const artworks = await Artwork.aggregate([{ $sample: { size: 16 } }]);
    if (artworks?.length >= 1) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

exports.getRandomArtworksByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const artworks = await Artwork.aggregate([
      { $match: { category: category } },
      { $sample: { size: 16 } },
    ]);
    if (artworks?.length >= 1) {
      return res.status(200).json(artworks);
    }
    next(createError.notFound("Aucune oeuvre trouvée"));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/artworks/verify/:kuciobkId
 * Endpoint public (sans authentification) — vérification du Standard Kucibok.
 * Scannable via QR code sur le certificat physique ou PDF.
 */
exports.verifyArtwork = async (req, res, next) => {
  try {
    const { kuciobkId } = req.params;
    const artwork = await Artwork.findOne({ kuciobkId })
      .select("kuciobkId title artist category medium height width description status certificatePath created")
      .lean();

    if (!artwork) return next(createError.notFound("Œuvre introuvable ou identifiant invalide."));
    if (artwork.status !== "approved") {
      return res.status(200).json({
        verified: false,
        kuciobkId,
        message: "Cette œuvre n'est pas encore certifiée par Kucibok.",
      });
    }

    return res.status(200).json({
      verified: true,
      kuciobkId: artwork.kuciobkId,
      title: artwork.title,
      artist: artwork.artist,
      category: artwork.category,
      medium: artwork.medium || null,
      dimensions: artwork.height && artwork.width ? `${artwork.height} × ${artwork.width} cm` : null,
      certifiedAt: artwork.created,
      certificateUrl: artwork.certificatePath || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/artworks/catalogue — Catalogue certifié (professionnel + admin)
 * Retourne les œuvres approuvées avec filtres et pagination.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
exports.getCataloguePro = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      availabilityStatus,
      priceMin,
      priceMax,
      search,
    } = req.query;

    const filter = { status: 'approved' };

    if (category) filter.category = category;
    if (availabilityStatus) filter.availabilityStatus = availabilityStatus;
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Artwork.countDocuments(filter);
    const artworks = await Artwork.find(filter)
      .select('kuciobkId title artist image category medium condition provenance price currency availabilityStatus certificatePath height width weight created')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return res.status(200).json({
      data: artworks,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(createError.internal(error.message));
  }
};
