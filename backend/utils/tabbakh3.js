const nodemailer = require("nodemailer");
const User = require("../models/Tourist.js"); // Adjust the path to your User model

require("dotenv").config(); // Load environment variables

const sendNotificationEmails = async (email, name, itineraryName , itineraryDate) => {
  try {
    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like "Outlook" or SMTP server
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASSWORD, // Replace with your email password or app password
      },
    });

    // Iterate through each user and send an email
        await transporter.sendMail({
          from: process.env.EMAIL_USER, // Sender address
          to: email, // Receiver email
          subject: `activity ${itineraryName} is now active!`,
          text: `Hello ${name},\n\nReminder: Your itinerary "${
                    itinerary.name
                  }" starts on ${itineraryDate.format("YYYY-MM-DD")}.`,
        });
  } catch (error) {
    console.error("Error sending notification emails:", error);
  }
};

module.exports = sendNotificationEmails;
