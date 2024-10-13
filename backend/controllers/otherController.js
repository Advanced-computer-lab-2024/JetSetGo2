const otherModel = require("../models/Other.js");
const { default: mongoose } = require("mongoose");

const createOther = async (req, res) => {
  // Create an other after sign up
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
    const other = await otherModel.create({
      UserName,
      Email,
      Password,
      AccountType,
      IDDocument, // Include the extracted file name for ID document
      Certificates, // Include the extracted file name for certificates (if applicable)
      TaxationRegistryCard, // Include the extracted file name for taxation registry card (if applicable)
    });

    res.status(201).json(other); // Use 201 for resource creation
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOther = async (req, res) => {
  try {
    const other = await otherModel.find({});
    res.status(200).json(other);
  } catch (error) {
    res.status(400).json({ error: error.messege });
  }
};

const deleteAllOthers = async (req, res) => {
  try {
    await otherModel.deleteMany({});
    res.status(200).json({ message: "All Others have been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOther, getOther, deleteAllOthers };
