// // jobs/deleteUnverifiedUsers.js
// const cron = require("node-cron");
// const User = require("../models/User");
// const Wallet = require("../models/Wallet");
// const Artist = require("../models/Artist");
// const Profile = require("../models/Profile");

// cron.schedule("*/5 * * * *", async () => {
//   const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

//   try {
//     const usersToDelete = await User.find({
//       isEmailVerified: false,
//       createdAt: { $lte: thirtyDaysAgo },
//     });

//     for (const user of usersToDelete) {
//       await Promise.all([
//         Wallet.deleteOne({ userId: user._id }),
//         Artist.deleteOne({ userId: user._id }),
//         Profile.deleteOne({ userId: user._id }),
//       ]);
//       await user.deleteOne();
//       console.log(`Utilisateur supprimé: ${user.email}`);
//     }

//     if (usersToDelete.length > 0) {
//       console.log(
//         `${usersToDelete.length} utilisateurs non vérifiés supprimés.`
//       );
//     }
//   } catch (err) {
//     console.error("Erreur lors du cron de suppression:", err.message);
//   }
// });
