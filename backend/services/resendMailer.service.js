const resend = require('../config/resendConfig');
const { config } = require('../config/environnement');

// Email Sender - Use Resend's default sender for free tier
const FROM_EMAIL = 'onboarding@resend.dev';

exports.sendVerificationEmail = async (email, name, link) => {
  try {
    console.log("Sending verification email to:", email);
    console.log("From:", FROM_EMAIL);
    
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Vérification de votre adresse email",
      html: `
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
      `,
    });
    
    console.log("Resend response:", data);
    console.log("Email de vérification envoyé avec succès à", email);
    return data;
  } catch (error) {
    console.error("Erreur d'envoi email de vérification:", error);
  }
};

exports.sendWelcomeEmail = async (email, name) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
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
    });
    console.log("Email de bienvenue envoyé avec succès");
    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);
  }
};

exports.sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
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
    });
    console.log("Email de réinitialisation envoyé avec succès à", email);
    return data;
  } catch (error) {
    console.error("Erreur d'envoi email de réinitialisation:", error);
  }
};

exports.sendUserRegistrationAlertToAdmin = async (user) => {
  const { name, email, telephone, role } = user;
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: config.adminEmail,
      subject: "Nouvelle inscription sur Kucibok",
      html: `
        <div style="background:#18181b;padding:10px 0;font-family:'Segoe UI',Arial,sans-serif;color:#fff;text-align:center;">
          <div style="max-width:400px;margin:40px auto;background:#23232a;border-radius:14px;padding:32px 20px 24px 20px;box-shadow:0 2px 12px #0002;">
            <div style="font-size:1.3rem;font-weight:700;letter-spacing:0.5px;color:#a5b4fc;margin-bottom:10px;">Kucibok</div>
            <div style="font-size:1.05rem;font-weight:500;margin-bottom:18px;">Nouvelle inscription</div>
            <div style="font-size:0.98rem;color:#cbd5e1;margin-bottom:22px;">Un nouvel utilisateur vient de s'inscrire :</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Nom : ${name}</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Email : ${email}</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Téléphone : ${telephone || "Non renseigné"}</div>
            <div style="font-size:0.93rem;color:#94a3b8;margin-bottom:10px;">Rôle : ${role || "Non renseigné"}</div>
            <div style="margin-top:28px;font-size:0.93rem;color:#64748b;">— L'équipe Kucibok</div>
          </div>
        </div>
      `,
    });
    console.log("Alerte d'inscription envoyée à l'administrateur");
    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'alerte d'inscription:", error);
  }
};
