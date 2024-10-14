const otherModel = require("../models/Other.js");
const mongoose = require("mongoose");
const createOther = async (req, res) => {
  console.log("Received request body:", req.body);
  console.log("Received files:", req.files);

  const { UserName, Email, Password, AccountType } = req.body;

  const IDDocument = req.files.IDDocument ? req.files.IDDocument[0].path : null;
  const Certificates = req.files.Certificates ? req.files.Certificates[0].path : null;
  const TaxationRegistryCard = req.files.TaxationRegistryCard ? req.files.TaxationRegistryCard[0].path : null;

  try {
    if (!UserName || !Email || !Password || !AccountType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const other = await otherModel.create({
      UserName,
      Email,
      Password,
      AccountType,
      IDDocument,
      Certificates,
      TaxationRegistryCard,
    });

    res.status(201).json({ message: "User created successfully", other });
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

const deleteAllOthers = async (req, res) => {
  try {
    await otherModel.deleteMany({});
    res.status(200).json({ message: "All users have been deleted" });
  } catch (error) {
    console.error("Error deleting users:", error); // Log error for debugging
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOther, getOther, deleteAllOthers };
