const adminModel = require("../models/admin"); // Adjust the path if necessary
const bcrypt = require("bcrypt");


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
};
