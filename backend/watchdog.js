require("dotenv").config();
const fetch = require("node-fetch");
const transporter = require("./config/mailerConfig.js");

// Vérification SMTP au démarrage
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Erreur connexion SMTP:", error);
  } else {
    console.log("✅ Connexion SMTP OK");
    // Envoi d'un mail de test au démarrage
    transporter.sendMail(
      {
        from: `"Kucibok Monitoring" <${process.env.EMAIL_USER}>`,
        to: process.env.ALERT_RECEIVER,
        subject: "[TEST] Watchdog démarré",
        text: "Ceci est un mail de test envoyé au démarrage du watchdog.",
      },
      (err, info) => {
        if (err) {
          console.error("❌ Erreur envoi mail de test:", err);
        } else {
          console.log("✅ Mail de test envoyé:", info.response);
        }
      }
    );
  }
});

async function sendAlertMail(subject, message) {
  try {
    await transporter.sendMail({
      from: `"Kucibok Monitoring" <${process.env.EMAIL_USER}>`,
      to: process.env.ALERT_RECEIVER,
      subject: "Watchdog Alerte: " + subject,
      text: message,
    });
    console.log("✅ Mail d’alerte envoyé !");
  } catch (err) {
    console.error("❌ Erreur envoi mail:", err);
  }
}

// Check toutes les minutes
setInterval(async () => {
  try {
    let res = await fetch("http://localhost:3000/health");
    if (!res.ok) throw new Error("Status code " + res.status);
    console.log("✅ Serveur OK");
  } catch (err) {
    console.error("❌ Serveur KO:", err.message);
    await sendAlertMail(
      "Crash détecté",
      "Le serveur ne répond pas: " + err.message
    );
  }
}, 60000);

module.exports = { sendAlertMail };
