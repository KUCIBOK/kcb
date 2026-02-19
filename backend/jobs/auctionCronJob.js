const cron = require("node-cron");
const Auction = require("../models/Auction"); // adapte le chemin à ton projet
const mongoose = require("mongoose");

const updateAuctionStatuses = async () => {
  const now = new Date();

  try {
    const upcoming = await Auction.updateMany(
      {
        status: "upcoming",
        startTime: { $lte: now },
      },
      {
        $set: { status: "ongoing" },
      }
    );

    const ended = await Auction.updateMany(
      {
        status: "ongoing",
        endTime: { $lte: now },
      },
      {
        $set: { status: "ended" },
      }
    );

    if (upcoming.modifiedCount > 0 || ended.modifiedCount > 0) {
      console.log(
        `[CRON] ${upcoming.modifiedCount} enchère(s) activée(s), ${ended.modifiedCount} terminée(s)`
      );
    }
  } catch (err) {
    console.error(
      "[CRON] Erreur dans la mise à jour des statuts d’enchères",
      err
    );
  }
};

// ⏱️ Exécute toutes les minutes
cron.schedule("* * * * *", async () => {
  await updateAuctionStatuses();
});
