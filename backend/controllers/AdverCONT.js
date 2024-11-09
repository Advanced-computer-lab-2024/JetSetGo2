const adverModel = require("../models/AdverMODEL.js");
const { default: mongoose } = require("mongoose");

const getAdver = async (req, res) => {
  const { id } = req.params;
  try {
    const adver = await adverModel.findById(id);
    res.status(200).json(adver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAdvertiser = async (req, res) => {
  try {
    const adver = await adverModel.find();
    res.status(200).json(adver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAdverById = async (req, res) => {
  const { id } = req.params;
  try {
    const adver = await adverModel.findByI(id);
    res.status(200).json(adver);
  } catch (error) {
    res.status(400).json({ error: error.messege });
  }
};

const updateAdver = async (req, res) => {
  const { id } = req.params;
  const logo = req.file ? req.file.filename.split("/").pop() : null;

  // Create an object to hold the fields to update
  const UpdateAdver = {};

  // Update the fields based on the request body
  if (req.body.UserName) UpdateAdver.UserName = req.body.UserName;
  if (req.body.Link) UpdateAdver.Link = req.body.Link;
  if (req.body.Hotline) UpdateAdver.Hotline = req.body.Hotline;
  if (req.body.Email) UpdateAdver.Email = req.body.Email;
  if (req.body.Profile) UpdateAdver.Profile = req.body.Profile;
  if (req.body.Loc) UpdateAdver.Loc = req.body.Loc;
  if (req.body.CompanyDes) UpdateAdver.CompanyDes = req.body.CompanyDes;
  if (req.body.Services) UpdateAdver.Services = req.body.Services;
  if (logo) UpdateAdver.logo = logo;

  // Set Profile_Completed to true if any profile field is updated
  UpdateAdver.Profile_Completed = true;

  try {
    // Use findByIdAndUpdate with the correct syntax
    const updatedAdver = await adverModel.findByIdAndUpdate(
      id,
      { $set: UpdateAdver },
      { new: true } // Return the updated document
    );

    if (!updatedAdver) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    res.status(200).json(updatedAdver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAdver = async (req, res) => {
  console.log("Request to delete Advertiser:", req.params.id); // Log the ID
  try {
    const { id } = req.params;
    const deletedAdver = await adverModel.findByIdAndDelete(id);

    if (!deletedAdver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedAdver,
    });
  } catch (error) {
    console.error("Error deleting tourism governor:", error);
    res.status(500).json({
      message: "Error deleting user",
      error,
    });
  }
};

// Export the router
module.exports = {
  getAdver,
  updateAdver,
  getAdverById,
  getAdvertiser,
  deleteAdver,
};
