const cron = require("node-cron");
const Auction = require("../models/Auction");
const logger = require("../utils/logger");

const updateAuctionStatuses = async () => {
  // P3-PERF-002 — Guard clause : skip si aucune enchère active ou à venir
  const hasActive = await Auction.exists({ status: { $in: ["upcoming", "ongoing"] } });
  if (!hasActive) return;

  const now = new Date();

  try {
    const upcoming = await Auction.updateMany(
      { status: "upcoming", startTime: { $lte: now } },
      { $set: { status: "ongoing" } }
    );

    const ended = await Auction.updateMany(
      { status: "ongoing", endTime: { $lte: now } },
      { $set: { status: "ended" } }
    );

    if (upcoming.modifiedCount > 0 || ended.modifiedCount > 0) {
      logger.info(`[CRON] ${upcoming.modifiedCount} enchère(s) activée(s), ${ended.modifiedCount} terminée(s)`);
    }
  } catch (err) {
    logger.error("[CRON] Erreur dans la mise à jour des statuts d’enchères", { err });
  }
};

// ⏱️ P3-PERF-002 — Toutes les 5 minutes (était toutes les minutes)
cron.schedule("*/5 * * * *", async () => {
  await updateAuctionStatuses();
});
