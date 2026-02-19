const Auction = require("../models/Auction");
const Artwork = require("../models/Artwork");
const {createError} = require("../middleware/errorHandler");

exports.createAuction = async (req, res, next) => {
  try {
    const { artworkId, startingPrice, startTime, endTime } = req.body;

    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return next(createError.notFound("Œuvre introuvable."));
    }

    if (artwork.auctionStatus !== "auction_ongoing") {
      return next(createError.badRequest("Cette œuvre n'est pas marquée pour une enchère."));
    }

    const existingAuction = await Auction.findOne({ artwork: artworkId });
    if (existingAuction) {
      return next(createError.conflict("Une enchère existe déjà pour cette œuvre."));
    }

    // Vérifie que les dates sont valides
    const now = new Date();
    if (new Date(startTime) < now) {
      return next(createError.badRequest("La date de début ne peut pas être dans le passé."));
    }
    if (new Date(endTime) <= new Date(startTime)) {
      return next(createError.badRequest("La date de fin doit être après la date de début."));
    }

    const auction = new Auction({
      artwork: artworkId,
      seller: req.user._id,
      startingPrice,
      currentPrice: startingPrice,
      startTime,
      endTime,
      status: "upcoming", // On démarre comme "à venir"
    });

    await auction.save();

    return res
      .status(201)
      .json({ message: "Enchère créée avec succès.", auction });
  } catch (error) {
    console.error("Erreur lors de la création d'une enchère:", error);
    next(createError.internal("Erreur serveur lors de la création de l'enchère."));
  }
};

exports.getOngoingAuctions = async (req, res, next) => {
  try {
    const now = new Date();
    console.log(`Fetching ongoing auctions at ${now}`);

    const auctions = await Auction.find({
      status: "ongoing",
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .populate("artwork", "title image")
      .populate("seller", "name");

    console.log(`Found ${auctions.length} auctions`);
    console.log(auctions);

    res.status(200).json(auctions);
  } catch (error) {
    console.error(error);
    next(createError.internal("Erreur lors du chargement des enchères."));
  }
};

exports.getAuctionById = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate({
        path: "artwork",
        populate: { path: "artist", select: "name" },
      })
      .populate("seller", "name");

    if (!auction) {
      return next(createError.notFound("Enchère introuvable."));
    }

    res.status(200).json(auction);
  } catch (error) {
    console.error(error);
    next(createError.internal("Erreur serveur lors de la récupération de l'enchère."));
  }
};

exports.getAuctionDetails = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate({
        path: "artwork",
        populate: {
          path: "artist",
          select: "name image",
        },
      })
      .populate("seller", "name")
      .populate("winner", "name")
      .populate({
        path: "bids",
        populate: {
          path: "bidder",
          select: "name image",
        },
        options: { sort: { createdAt: -1 } }, // Tri par date décroissante
      });

    if (!auction) {
      return next(createError.notFound("Enchère introuvable."));
    }

    // Formater les données pour le frontend
    const response = {
      artwork: {
        title: auction.artwork.title,
        description: auction.artwork.description,
        image: auction.artwork.image,
        category: auction.artwork.category,
        dimensions: auction.artwork.dimensions,
        artist: auction.artwork.artist,
      },
      seller: auction.seller,
      currentPrice: auction.currentPrice,
      startingPrice: auction.startingPrice,
      startTime: auction.startTime,
      endTime: auction.endTime,
      bids: auction.bids,
      bidCount: auction.bids.length,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    next(createError.internal("Erreur serveur lors de la récupération des détails de l'enchère."));
  }
};
