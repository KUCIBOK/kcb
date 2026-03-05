require("dotenv").config();
const fetch = require("node-fetch");
const { sendAlertMail } = require("./services/mailer.service");
const logger = require("./utils/logger");

// Check toutes les minutes
setInterval(async () => {
  try {
    let res = await fetch("http://localhost:3000/health");
    if (!res.ok) throw new Error("Status code " + res.status);
    logger.info("Serveur OK");
  } catch (err) {
    logger.error("Serveur KO:", { error: err.message });
    await sendAlertMail(
      "Crash détecté",
      "Le serveur ne répond pas: " + err.message
    );
  }
}, 60000);

module.exports = { sendAlertMail };
