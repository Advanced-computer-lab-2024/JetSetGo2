const nodemailer = require('nodemailer');

const sendEmailToSeller = async (sellerEmail,proddescription) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
    auth: {
      user: process.env.EMAIL_USER,  // Your email address
      pass: process.env.EMAIL_PASSWORD,    // Your email password or app-specific password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sellerEmail,
    subject: 'Product Quantity Finished',
    text: `Dear Seller, \n\nThe quantity of your product ("${proddescription}") has reached zero. Please restock it if you'd like to continue selling it.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
module.exports = { sendEmailToSeller };