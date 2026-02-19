const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kucibok.test@gmail.com',
    pass: 'testpassword123' // This won't work - need app password
  }
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: '"Kucibok Test" <kucibok.test@gmail.com>',
      to: 'recipient@example.com',
      subject: 'Test Email from Kucibok',
      text: 'This is a test email from the Kucibok application.',
      html: '<h1>Test Email</h1><p>This is a test email from the Kucibok application.</p>'
    });
    
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendTestEmail();
