const adminModel = require("../models/admin"); // Adjust the path if necessary
const adverModel = require("../models/AdverMODEL"); // Advertiser model
const touristModel = require("../models/Tourist"); // Tourist model
const tourGuideModel = require("../models/TGuide"); // Tour guide model
const sellerModel = require("../models/Seller"); // Seller model

const bcrypt = require("bcrypt");

const getNewUsersByMonth = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Get the current month (1-based index)

    // Helper function to get the number of users for a specific month
    const getMonthlyCounts = async (model) => {
      return await model.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${targetYear}-${currentMonth}-01T00:00:00.000Z`),
              $lt: new Date(
                `${targetYear}-${currentMonth + 1}-01T00:00:00.000Z`
              ),
            },
            Admin_Acceptance: true, // Add the condition for admin acceptance
          },
        },
        {
          $group: {
            _id: null, // No need to group by month anymore, just get total count
            count: { $sum: 1 },
          },
        },
      ]);
    };

    // Fetch the counts for each user model (advertisers, tourists, tour guides, sellers)
    const advertiserCounts = await getMonthlyCounts(adverModel);
    const touristCounts = await getMonthlyCounts(touristModel);
    const tourGuideCounts = await getMonthlyCounts(tourGuideModel);
    const sellerCounts = await getMonthlyCounts(sellerModel);

    // Calculate total users for the current month by summing counts from all models
    const totalAcceptedUsersThisMonth =
      (advertiserCounts[0]?.count || 0) +
      (touristCounts[0]?.count || 0) +
      (tourGuideCounts[0]?.count || 0) +
      (sellerCounts[0]?.count || 0);

    res.status(200).json({
      year: targetYear,
      currentMonth, // Return the current month number
      totalAcceptedUsersThisMonth, // Return the total count of accepted users for the current month
    });
  } catch (error) {
    console.error("Error fetching new users by month:", error);
    res.status(500).json({
      message: "Error fetching new users by month",
      error: error.message,
    });
  }
};

const getTotalUsers = async (req, res) => {
  try {
    // Count the number of users with admin acceptance set to true in each model
    const advertiserCount = await adverModel.countDocuments({
      Admin_Acceptance: true,
    });
    const touristCount = await touristModel.countDocuments({
      Admin_Acceptance: true,
    });
    const tourGuideCount = await tourGuideModel.countDocuments({
      Admin_Acceptance: true,
    });
    const sellerCount = await sellerModel.countDocuments({
      Admin_Acceptance: true,
    });

    // Calculate the total number of users
    const totalUsers =
      advertiserCount + touristCount + tourGuideCount + sellerCount;

    // Send the response with the total user count
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    res.status(500).json({
      message: "Error calculating total users",
      error: error.message,
    });
  }
};

// Create Admin
const createAdmin = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming request body for debugging

    const { Username, Email, Password } = req.body;

    // Validation: check if username, email, and password are present and not null
    if (!Username || !Email || !Password) {
      return res.status(400).json({
        message: "Username, email, and password are required.",
      });
    }

    console.log("Validated data:", { Username, Email, Password }); // Log the validated data

    const newAdmin = new adminModel({
      Username,
      Email,
      Password,
      Admin_Acceptance: true,
    });
    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedAdmin,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Get all Admins
const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching admins",
      error: error.message,
    });
  }
};

// Get Admin by ID
const getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await adminModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      message: "Admin fetched successfully",
      admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching admin",
      error: error.message,
    });
  }
};

// Delete Admin by ID
const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const deletedAdmin = await adminModel.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting admin",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    console.log("Endpoint hit - updatePassword");
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required." });
    }

    const updatedPassword = newPassword;

    const updatedAdmin = await adminModel.findByIdAndUpdate(
      id,
      { Password: updatedPassword },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({
      message: "Error updating password.",
      error: error.message,
    });
  }
};

// Export the controller methods
module.exports = {
  createAdmin,
  getAdmins,
  getAdminById,
  deleteAdmin,
  updatePassword,
  getTotalUsers,
  getNewUsersByMonth, // Add this line
};
