const nodemailer = require("nodemailer");

// Create transporter using Gmail service (or another email provider)
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail's SMTP service (or any other service you prefer)
  auth: {
    user: process.env.EMAIL_USER, // Your email address from .env file
    pass: process.env.EMAIL_PASSWORD, // Your email password (Gmail App Password for 2FA users)
  },
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to: email, // Receiver's email address
    subject: "Your OTP Code", // Subject of the email
    text: `Your OTP code is: ${otp}`, // Email body text
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

module.exports = sendOtpEmail;
