const cron = require("node-cron");
const {expireSubscriptions} = require("../services/subscription.service");

cron.schedule("0 0 * * *", async () => {
    await expireSubscriptions();
}); // Tous les jours à minuit