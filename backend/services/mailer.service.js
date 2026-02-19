const resend = require('../config/resendConfig');
const { createInvoiceForArtwork } = require('./documents.service');
const {config} = require('../config/environnement');

const FROM_EMAIL = 'onboarding@resend.dev';

// Helper function to send email via Resend
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      attachments: attachments.length > 0 ? attachments : undefined
    });
    return result;
  } catch (error) {
    console.error('Erreur Resend:', error);
    throw error;
  }
};

// Legacy transporter wrapper for compatibility
const transporter = {
  sendMail: async (mailOptions) => {
    return sendEmail(mailOptions.to, mailOptions.subject, mailOptions.html);
  }
};

exports.sendVerificationEmail = async (email, name, link) => {
  const html = `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Bonjour ${name}, voici le mail de vérification</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Cliquez sur le bouton ci-dessous pour activer votre compte.</div>
          <a target="_blank" href="${link}" style="display:inline-block;padding:11px 28px;background:#6366f1;color:#fff;border-radius:7px;font-weight:600;font-size:1rem;text-decoration:none;letter-spacing:0.5px;margin-bottom:18px;">Valider l'email</a>
          <div style="font-size:0.93rem;color:#94a3b8;margin:22px 0 0 0;">Ce lien expire dans 15 minutes.</div>
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `;

  try {
    await sendEmail(email, "Vérification de votre adresse email", html);
    console.log("Email de vérification envoyé avec succès à", email);
  } catch (error) {
    console.error("Erreur d'envoi email de vérification:", error);
  }
};

exports.sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: config.adminEmail,
    to: email,
    subject: "Bienvenue sur Kucibok !",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Bienvenue ${name} !</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Merci de vous être inscrit sur Kucibok.<br>Nous sommes ravis de vous accueillir dans la communauté !</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin:22px 0 0 0;">Explorez, collectionnez, partagez et vivez l'art autrement.</div>
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de bienvenue envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
  }
};

exports.sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: config.adminEmail,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Réinitialisation de mot de passe</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.</div>
          <a target="_blank" href="${resetLink}" style="display:inline-block;padding:11px 28px;background:#6366f1;color:#fff;border-radius:7px;font-weight:600;font-size:1rem;text-decoration:none;letter-spacing:0.5px;margin-bottom:18px;">Réinitialiser mon mot de passe</a>
          <div style="font-size:0.93rem;color:#94a3b8;margin:22px 0 0 0;">Ce lien expire dans 15 minutes.<br>Si ce n'est pas vous, ignorez cet email.</div>
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de réinitialisation envoyé avec succès à", email);
  } catch (error) {
    console.error("Erreur d'envoi email de réinitialisation:", error);
  }
};

exports.sendUserRegistrationAlertToAdmin = async (user) => {
  const { name, email, telephone, role } = user;
  const mailOptions = {
    from: config.adminEmail,
    to: process.env.ADMIN_EMAIL,
    subject: "Nouvelle inscription sur Kucibok",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Nouvelle inscription</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Un nouvel utilisateur vient de s'inscrire :</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Nom : ${name}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Email : ${email}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Téléphone : ${
            telephone || "Non renseigné"
          }</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Rôle : ${
            role || "Non renseigné"
          }</div>
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Alerte d'inscription envoyée à l'administrateur");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'alerte d'inscription:", error);
  }
};

exports.sendArtworkSubmissionAlertToAdmin = async (artwork) => {
  const { title, artist, description, image } = artwork;
  const mailOptions = {
    from: config.adminEmail,
    to: process.env.ADMIN_EMAIL,
    subject: "Nouvelle soumission d'œuvre sur Kucibok",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;color:#a5b4fc;font-weight:500;margin-bottom:18px;">Nouvelle soumission d'œuvre</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Une nouvelle œuvre a été soumise :</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Titre : ${title}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Artiste : ${artist}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Description : ${
            description || "Aucune description fournie"
          }</div>
          ${
            image
              ? `<img src="${image}" alt="${title}" style="max-width:100%;border-radius:8px;margin-top:12px;" />`
              : ""
          }
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Alerte de soumission d'œuvre envoyée à l'administrateur");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'alerte de soumission d'œuvre:",
      error
    );
  }
};

exports.sendArtworkValidationEmail = async (email, artwork) => {
  const { title, artist, description, image } = artwork;
  const mailOptions = {
    from: config.adminEmail,
    to: email,
    subject: "Validation de votre œuvre sur Kucibok",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Validation de votre œuvre</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Votre œuvre "${title}" a été validée.</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Titre : ${title}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Artiste : ${artist}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Description : ${
            description || "Aucune description fournie"
          }</div>
          ${
            image
              ? `<img src="${image}" alt="${title}" style="max-width:100%;border-radius:8px;margin-top:12px;" />`
              : ""
          }
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de validation d'œuvre envoyé");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de validation d'œuvre:",
      error
    );
  }
};

exports.sendArtworkRejectionEmail = async (email, artwork, reason) => {
  const { title, artist, description, image } = artwork;
  const mailOptions = {
    from: config.adminEmail,
    to: email,
    subject: "Rejet de votre œuvre sur Kucibok",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Rejet de votre œuvre</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Nous sommes désolés, votre œuvre "${title}" a été rejetée pour la raison suivante :</div>
          <div style="font-size:0.93rem;color:#f87171;margin-bottom:10px;">${
            reason || "Aucune raison fournie"
          }</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Titre : ${title}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Artiste : ${artist}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Description : ${
            description || "Aucune description fournie"
          }</div>
          ${
            image
              ? `<img src="${image}" alt="${title}" style="max-width:100%;border-radius:8px;margin-top:12px;" />`
              : ""
          }
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de rejet d'œuvre envoyé");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de rejet d'œuvre:", error);
  }
};

exports.sendArtworkPurchaseEmailToUser = async (
  email,
  artwork,
  transaction,
  seller,
  buyer
) => {
  const { title, artist, image } = artwork;
  const { amount, createdAt } = transaction;
  const mailOptions = {
    from: config.adminEmail,
    to: email,
    subject: "Achat d'œuvre sur Kucibok",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Achat d'œuvre</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Merci pour votre achat ! Voici les détails de votre transaction :</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Titre : ${title}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Artiste : ${artist}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Montant : ${amount} €</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Date : ${new Date(
            createdAt
          ).toLocaleDateString()}</div>
          ${
            image
              ? `<img src="${image}" alt="${title}" style="max-width:100%;border-radius:8px;margin-top:12px;" />`
              : ""
          }
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    const invoice = await createInvoiceForArtwork(artwork, buyer, seller);
    if (invoice.success) {
      mailOptions.attachments = [
        {
          filename: `facture-${artwork?._id}.pdf`,
          path: invoice.filePath,
        },
        {
          filename: `certificat-${artwork?._id}.pdf`,
          path: artwork?.certificatePath || "",
        },
      ];
    }

    await transporter.sendMail(mailOptions);
    console.log("Email d'achat d'œuvre envoyé");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email d'achat d'œuvre:", error);
  }
};

exports.sendArtworkPurchaseEmailToAdmin = async (
  artwork,
  transaction,
  buyer
) => {
  const { title, artist, image } = artwork;
  const { amount, createdAt } = transaction;
  const mailOptions = {
    from: config.adminEmail,
    to: process.env.ADMIN_EMAIL,
    subject: "Achat d'œuvre sur Kucibok",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Achat d'œuvre</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Un utilisateur a acheté une œuvre :</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Titre : ${title}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Artiste : ${artist}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Montant : ${amount} €</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Acheteur ID : ${
            buyer?.name
          }</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Date : ${new Date(
            createdAt
          ).toLocaleDateString()}</div>
          ${
            image
              ? `<img src="${image}" alt="${title}" style="max-width:100%;border-radius:8px;margin-top:12px;" />`
              : ""
          }
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email d'achat d'œuvre envoyé à l'administrateur");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email d'achat d'œuvre à l'administrateur:",
      error
    );
  }
};

exports.sendSubscriptionPaymentEmailToUser = async (
  email,
  subscriptionDetails
) => {
  const { planName, amount, nextPaymentDate } = subscriptionDetails;
  const mailOptions = {
    from: config.adminEmail,
    to: email,
    subject: "Paiement d'abonnement Kucibok",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Paiement d'abonnement</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Merci pour votre paiement ! Voici les détails :</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Plan : ${planName}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Montant : ${amount} €</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Prochain paiement : ${new Date(
            nextPaymentDate
          ).toLocaleDateString()}</div>
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de paiement d'abonnement envoyé");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de paiement d'abonnement:",
      error
    );
  }
};

exports.sendSubscriptionPaymentEmailToAdmin = async (
  subscriptionDetails,
  user
) => {
  const { planName, amount, nextPaymentDate } = subscriptionDetails;
  const mailOptions = {
    from: config.adminEmail,
    to: process.env.ADMIN_EMAIL,
    subject: "Paiement d'abonnement Kucibok",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Paiement d'abonnement</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Un utilisateur a effectué un paiement d'abonnement :</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Utilisateur : ${
            user.name
          } (${user.email})</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Plan : ${planName}</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Montant : ${amount} €</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Prochain paiement : ${new Date(
            nextPaymentDate
          ).toLocaleDateString()}</div>
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de paiement d'abonnement envoyé à l'administrateur");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de paiement d'abonnement à l'administrateur:",
      error
    );
  }
};

exports.sendEmailChangeNotification = async (email, newEmail) => {
  const mailOptions = {
    from: config.adminEmail,
    to: email,
    subject: "Changement d'adresse e-mail",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Changement d'adresse e-mail</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Votre adresse e-mail a été changée avec succès.</div>
          <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Nouvelle adresse e-mail : ${newEmail}</div>
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification de changement d'e-mail envoyée");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de la notification de changement d'e-mail:",
      error
    );
  }
};

exports.sendPasswordChangeNotification = async (email) => {
  const mailOptions = {
    from: config.adminEmail,
    to: email,
    subject: "Changement de mot de passe",
    html: `
      <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
        <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
          <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
          <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Changement de mot de passe</div>
          <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Votre mot de passe a été changé avec succès.</div>
          <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification de changement de mot de passe envoyée");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de la notification de changement de mot de passe:",
      error
    );
  }
};

exports.sendDeliveryRequestNotificationToAdmin = async (delivery) => {
  try {
    const mailOptions = {
      from: config.adminEmail,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouvelle demande de livraison",
      html: `
        <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
          <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
            <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
            <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Nouvelle demande de livraison</div>
            <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Une nouvelle demande de livraison a été créée :</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Destinataire : ${delivery.recipientName}</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Numéro de téléphone : ${delivery.recipientPhone}</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Destination : ${delivery.deliveryAddress}</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Priorité : ${delivery.deliveryPriority}</div>
            <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      "Notification de nouvelle demande de livraison envoyée à l'administrateur"
    );
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de la notification de livraison à l'admin :",
      error
    );
  }
};

exports.sendDeliveryRequestNoficationToCustomer = async (email, delivery) => {
  try {
    const mailOptions = {
      from: config.adminEmail,
      to: email,
      subject: "Mise à jour livraison",
      html: `
        <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
          <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
            <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
            <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Mise à jour de la demande de livraison</div>
            <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Une mise à jour a été effectuée :</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Destinataire : ${
              delivery.recipientName
            }</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Numéro de téléphone : ${
              delivery.recipientPhone
            }</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Destination : ${
              delivery.deliveryAddress
            }</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Priorité : ${
              delivery.deliveryPriority
            }</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Statut : ${
              delivery.status == "pending"
                ? "En attente"
                : delivery.status == "in_preparation"
                ? "En préparation"
                : delivery.status == "on_the_way"
                ? "En route"
                : delivery.status == "delivered"
                ? "Livrée"
                : "Rejetée"
            }</div>
            ${
              delivery.status == "rejected"
                ? `<div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Raison du rejet : ${delivery.reason}</div>`
                : ""
            }
            <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Notification de mise à jour client envoyée");
  } catch (error) {
    console.error("Erreur lors de l'envoi du mail à l'utilisateur");
  }
};

exports.sendNumerisationRequestAlertToAdmin = async (user, numReq) => {
  try {
    const mailOptions = {
      from: config.adminEmail,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouvelle demande de numérisation",
      html: `
        <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
          <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
            <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
            <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Nouvelle demande de numérisation</div>
            <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Une nouvelle demande de numérisation a été créée :</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Utilisateur : ${
              user.name
            } (${user.email})</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Description : ${
              numReq.description || "Aucune description fournie"
            }</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Statut : ${
              numReq.status
            }</div>
            <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Notification de soumission de requête envoyée");
  } catch (error) {
    console.error("Erreur lors de l'envoi du mail à l'utilisateur");
  }
};

exports.sendNumerisationRequestStatusChange = async (email, numReq) => {
  try {
    const mailOptions = {
      from: config.adminEmail,
      to: email,
      subject: "Mise à jour statut demande de numérisation",
      html: `
        <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
          <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
            <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
            <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Mise à jour de la demande de numérisation</div>
            <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Votre demande de numérisation a été mise à jour :</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Description : ${
              numReq.description || "Aucune description fournie"
            }</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Statut : ${
              numReq.status
            }</div>
            ${
              numReq.status === "rejected"
                ? `<div style="font-size:0.93rem;color:#f87171;margin-bottom:10px;">Raison du rejet : ${numReq.reason}</div>`
                : ""
            }
            <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Notification de mise à jour de requête envoyée");
  } catch (error) {
    console.error("Erreur lors de l'envoi du mail à l'utilisateur");
  }
};

exports.sendAlertMail = async function (subject, message) {
  try {
    await transporter.sendMail({
      from: `"Kucibok Monitoring" <${config.smtp.user}>`,
      to: process.env.ALERT_RECEIVER || config.smtp.user, // destinataire par défaut
      subject: "Alerte serveur: " + subject,
      text: message,
    });
    console.log("Mail d’alerte envoyé !");
  } catch (err) {
    console.error("Erreur envoi mail:", err);
  }
}
