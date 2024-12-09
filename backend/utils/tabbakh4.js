const nodemailer = require("nodemailer");
const User = require("../models/Tourist.js"); // Adjust the path to your User model
require("dotenv").config(); // Load environment variables

const sendActivityNotificationEmail = async (email, name, activityName, activityDate, activityTime) => {
  try {
    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like "Outlook" or an SMTP server
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASSWORD, // Replace with your email password or app password
      },
    });

    // Send an email to the user about the activity
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Receiver email
      subject: `Reminder: Activity "${activityName}" is coming up!`,
      text: `Hello ${name},\n\nThis is a friendly reminder about your activity:\n\n` +
            `Activity Name: ${activityName}\n` +
            `Scheduled Date: ${activityDate}\n` +
            `Scheduled Time: ${activityTime}\n\n` +
            `We hope you enjoy the experience!\n\nBest Regards,\nYour Team`,
    });

    console.log(`Notification email sent to ${email} for activity "${activityName}".`);
  } catch (error) {
    console.error("Error sending notification emails:", error);
  }
};

module.exports = sendActivityNotificationEmail;
