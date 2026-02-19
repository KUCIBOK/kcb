require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log("Testing SMTP connection...");
console.log("Host:", process.env.SMTP_HOST);
console.log("Port:", process.env.SMTP_PORT);
console.log("User:", process.env.SMTP_USER);

transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
  
  // Try sending a test email
  if (success) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Test SMTP - Kucibok",
      text: "This is a test email from Kucibok backend",
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log("Send Error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }
});
