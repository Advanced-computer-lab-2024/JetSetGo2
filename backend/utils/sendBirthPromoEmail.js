const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (email, promoCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎉 Happy Birthday! Your Special Promo Code 🎉",
    text: `Happy Birthday! Here's your exclusive promo code: ${promoCode}\n\nUse it before it expires!`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
