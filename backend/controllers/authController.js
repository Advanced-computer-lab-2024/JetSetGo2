require("dotenv").config();
const jwt = require("jsonwebtoken");
const SellerModel = require("../models/Seller.js");
const AdverModel = require("../models/AdverMODEL.js");
const TourModel = require("../models/TGuide.js");
const TouristModel = require("../models/Tourist.js");
const AdminModel = require("../models/admin.js");

// Login controller
const loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    let user = await SellerModel.findOne({ Email });
    let AccountType = "Seller";

    // If not found in Seller, search in Adver
    if (!user) {
      user = await AdverModel.findOne({ Email });
      AccountType = "Advertiser";
    }

    // If not found in Adver, search in TourGuide
    if (!user) {
      user = await TourModel.findOne({ Email });
      AccountType = "TourGuide";
    }

    if (!user) {
      user = await TouristModel.findOne({ Email });
      AccountType = "Tourist";
    }

    if (!user) {
      user = await AdminModel.findOne({ Email });
      AccountType = "Admin";
    }

    // If user is not found in any model
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    if (user.Password !== Password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token including AccountType
    const token = jwt.sign(
      { userId: user._id, Email: user.Email, AccountType: AccountType }, // Include AccountType
      process.env.JWT_SECRET, // Your secret key
      { expiresIn: "1h" } // Token expiration
    );

    res.json({
      token,
      userId: user._id,
      Email: user.Email,
      AccountType: AccountType,
      profileCompleted: user.Profile_Completed || false, // Assuming the field 'profileCompleted' exists
      adminAccept: user.Admin_Acceptance || false,
    }); // Send token, AccountType, and profileCompleted back to client
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { loginUser };
