const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const {createError} = require("../middleware/errorHandler");

exports.placeBid = async (req, res, next) => {
  try {
    const { auctionId, amount } = req.body;
    const userId = req.user._id;

    const auction = await Auction.findById(auctionId).populate("seller");

    if (!auction) {
      return next(createError.notFound("Enchère introuvable."));
    }

    // Vérifier que l'enchère est en cours
    const now = new Date();
    if (
      auction.status !== "ongoing" ||
      now < new Date(auction.startTime) ||
      now > new Date(auction.endTime)
    ) {
      return next(createError.badRequest("L'enchère n'est pas active."));
    }

    // Empêcher le vendeur d'enchérir sur sa propre enchère
    if (auction.seller._id.toString() === userId.toString()) {
      return next(createError.forbidden("Tu ne peux pas enchérir sur ta propre enchère."));
    }

    // Vérifier que le montant est supérieur à l'actuel
    if (amount <= auction.currentPrice) {
      return next(createError.badRequest("Le montant doit être supérieur au prix actuel."));
    }

    // Créer l’enchère
    const bid = new Bid({
      auction: auctionId,
      bidder: userId,
      amount,
    });
    await bid.save();

    // Ajouter le bid à l'enchère
    auction.bids.push(bid._id);

    auction.currentPrice = amount;
    auction.winner = userId;
    await auction.save();

    res.status(201).json({ message: "Offre placée avec succès.", bid });
  } catch (error) {
    next(createError.internal("Erreur serveur lors de la placement de l'enchère."));
  }
};
