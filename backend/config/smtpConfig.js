const nodemailer = require('nodemailer');

// Create SMTP transporter using Ethereal.email (temporary for testing)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'a5lkhnkissrowfzb@ethereal.email',
    pass: 'mXgvFtfQ4tS5vUEV46',
  },
});

module.exports = transporter;
