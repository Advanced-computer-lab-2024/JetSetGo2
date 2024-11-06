const otherModel = require("../models/Other.js");
const SellerModel = require("../models/Seller.js");
const TourModel = require("../models/TGuide.js");
const AdverModel = require("../models/AdverMODEL.js");

const mongoose = require("mongoose");

const createOther = async (req, res) => {
  const { UserName, Email, Password, AccountType } = req.body;

  // Ensure files are uploaded and present in req.files
  const IDDocument = req.files.IDDocument
    ? req.files.IDDocument[0].path.split("/").pop()
    : null; // Extract only the last part of the path for the ID document
  const Certificates = req.files.Certificates
    ? req.files.Certificates[0].path.split("/").pop()
    : null; // Extract only the last part of the path for the certificate (if applicable)
  const TaxationRegistryCard = req.files.TaxationRegistryCard
    ? req.files.TaxationRegistryCard[0].path.split("/").pop()
    : null; // Extract only the last part of the path for the taxation registry card (if applicable)

  try {
    if (AccountType == "Seller") {
      const seller = await SellerModel.create({
        UserName,
        Email,
        Password,
        IDDocument,
        TaxationRegistryCard,
        Profile_Completed: false,
      });
    }

    if (AccountType == "TourGuide") {
      const seller = await TourModel.create({
        UserName,
        Email,
        Password,
        IDDocument,
        Certificates,
        Profile_Completed: false,
      });
    }

    if (AccountType == "Advertiser") {
      const seller = await AdverModel.create({
        UserName,
        Email,
        Password,
        IDDocument,
        TaxationRegistryCard,
        Profile_Completed: false,
      });
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
};

const getOther = async (req, res) => {
  try {
    const others = await otherModel.find({});
    res.status(200).json(others);
  } catch (error) {
    console.error("Error fetching users:", error); // Log error for debugging
    res.status(400).json({ error: error.message });
  }
};

// Fetch Other user by ID
const getOtherById = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters
    const otherUser = await otherModel.findById(id); // Find the Other user by ID

    if (!otherUser) {
      return res.status(404).json({ error: "Other user not found" });
    }

    // Respond with the required fields (Name and Email)
    res.status(200).json({
      Name: otherUser.UserName, // Assuming UserName is the field for Name
      Email: otherUser.Email,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

const deleteAllOthers = async (req, res) => {
  try {
    await otherModel.deleteMany({});
    res.status(200).json({ message: "All users have been deleted" });
  } catch (error) {
    console.error("Error deleting users:", error); // Log error for debugging
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOther, getOther, getOtherById, deleteAllOthers };
