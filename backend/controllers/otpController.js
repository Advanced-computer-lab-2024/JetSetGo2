const sendOtpEmail = require("../utils/sendOtpEmail");
const otpGenerator = require("otp-generator"); // Library to generate OTPs
const SellerModel = require("../models/Seller.js");
const AdverModel = require("../models/AdverMODEL.js");
const TourModel = require("../models/TGuide.js");
const TouristModel = require("../models/Tourist.js");
const AdminModel = require("../models/admin.js");

// Controller to handle OTP sending
const sendOtp = async (req, res) => {
  const { email } = req.body;

  // Basic email validation
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  try {
    // Send OTP to the email
    await sendOtpEmail(email, otp);

    // You can store OTP in your database or cache with expiration time (e.g., 5 minutes)
    // For demonstration, we're sending the OTP in the response
    res.status(200).json({ message: "OTP sent successfully", email, otp }); // Do not send OTP in production!
  } catch (error) {
    // If there's an error, send a failure response
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

const verifyOtp = (req, res) => {
  const { email, otp, storedOtp } = req.body;

  if (!email || !otp || !storedOtp) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and stored OTP are required" });
  }

  if (otp !== storedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.json({ message: "OTP verified successfully" });
};

const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  try {
    // Find the user by email
    let user = await SellerModel.findOneAndUpdate(
      { Email: email },
      { $set: { Password: newPassword } }
    );

    // If not found in Seller, search in Adver
    if (!user) {
      user = await AdverModel.findOneAndUpdate(
        { Email: email },
        { $set: { Password: newPassword } }
      );
    }

    // If not found in Adver, search in TourGuide
    if (!user) {
      user = await TourModel.findOneAndUpdate(
        { Email: email },
        { $set: { Password: newPassword } }
      );
    }

    if (!user) {
      user = await TouristModel.findOneAndUpdate(
        { Email: email },
        { $set: { Password: newPassword } }
      );
    }

    if (!user) {
      user = await AdminModel.findOneAndUpdate(
        { Email: email },
        { $set: { Password: newPassword } }
      );
    }

    // If user is not found in any model
    if (!user) {
      return res.status(401).json({ message: "There is no such user" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err.message);
    res
      .status(500)
      .json({ message: "Failed to update password", error: err.message });
  }
};

module.exports = { sendOtp, verifyOtp, changePassword };
