const resend = require('../config/resendConfig');
const {config} = require('../config/environnement');

const FROM_EMAIL = 'onboarding@resend.dev';

// Legacy transporter wrapper for compatibility
const transporter = {
  sendMail: async (mailOptions) => {
    try {
      return await resend.emails.send({
        from: FROM_EMAIL,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html
      });
    } catch (error) {
      console.error('Erreur Resend:', error);
      throw error;
    }
  }
};

exports.sendCampaignMail = async (subject, content, email) => {
const mailOptions = {
    from: config.email.user,
    to: email,
    subject: subject,
    html: `
        <div style="background:#f6f8fa;padding:0;margin:0;font-family:'Segoe UI',Arial,sans-serif;color:#222;">
            <div style="max-width:420px;margin:48px auto;background:#fff;border-radius:16px;box-shadow:0 2px 16px 0 rgba(60,72,88,0.10);overflow:hidden;">
                <div style="padding:32px 28px 24px 28px;">
                    <div style="font-size:1.6rem;font-weight:700;letter-spacing:1px;color:#6366f1;margin-bottom:8px;">Kucibok</div>
                    <h2 style="font-size:1.25rem;font-weight:600;margin:0 0 18px 0;color:#222;">${subject}</h2>
                    <div style="font-size:1rem;color:#444;margin-bottom:24px;line-height:1.7;">
                        ${content}
                    </div>
                    <div style="margin-top:28px;font-size:0.97rem;color:#6366f1;font-style:italic;">
                        — L'équipe Kucibok
                    </div>
                </div>
            </div>
            <div style="text-align:center;margin:24px 0 0 0;font-size:0.93rem;color:#94a3b8;">
                © ${new Date().getFullYear()} Kucibok. Tous droits réservés.
            </div>
        </div>
    `,
};

  try {
    await transporter.sendMail(mailOptions);
    console.log("Campaign email sent successfully");
  } catch (error) {
    console.error("Error sending campaign email:", error);
  }
};
