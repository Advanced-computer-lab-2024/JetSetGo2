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

module.exports = { createOther };
