const nodemailer = require('nodemailer');

// Create a test account with Ethereal.email (free for testing)
async function createTestAccount() {
  try {
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('Test account created:');
    console.log('User:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('SMTP host:', testAccount.smtp.host);
    console.log('SMTP port:', testAccount.smtp.port);
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // Send test email
    const info = await transporter.sendMail({
      from: '"Kucibok Test" <test@kucibok.com>',
      to: 'recipient@example.com',
      subject: 'Test Email from Kucibok',
      text: 'This is a test email from the Kucibok application.',
      html: `
        <div style="background:#18181b;padding:20px;font-family:sans-serif;color:#fff;">
          <h1 style="color:#a5b4fc;">Kucibok</h1>
          <p>Bonjour,</p>
          <p>Ceci est un email de test depuis l'application Kucibok.</p>
          <p style="color:#64748b;">— L'équipe Kucibok</p>
        </div>
      `
    });
    
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return {
      user: testAccount.user,
      pass: testAccount.pass,
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure
    };
  } catch (error) {
    console.error('Error creating test account:', error);
  }
}

createTestAccount();
