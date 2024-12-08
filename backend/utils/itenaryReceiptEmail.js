require("dotenv").config();
const nodemailer = require("nodemailer");

const senditenaryreciept = async (userEmail, userName, itenaryprice) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use other services like SendGrid, Mailgun, etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Reciept of itenary",
    text: `Dear ${userName}, \n\n Your itenary you have booked with${itenaryprice} has been confirmed.`,
  };

  try {
    // Send the email and wait for the response
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    // Log the error if sending fails
    console.error("Error sending email:", error);
    throw new Error("Could not send OTP");
  }
};
module.exports = { senditenaryreciept };
