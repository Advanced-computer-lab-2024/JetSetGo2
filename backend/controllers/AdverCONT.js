const adverModel = require("../models/AdverMODEL.js");
const { default: mongoose } = require("mongoose");

const createAdver = async (req, res) => {
  const { Name, Link, Hotline, Mail, Profile, Loc, CompanyDes, Services } =
    req.body;
  const logo = req.file ? req.file.filename.split("/").pop() : null; // Get the logo path if uploaded
  try {
    const adver = await adverModel.create({
      Name,
      Link,
      Hotline,
      Mail,
      Profile,
      Loc,
      CompanyDes,
      Services,
      logo,
    });
    res.status(200).json(adver);
  } catch (error) {
    res.status(400).json({ error: error.messege });
  }
};

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
  const { id } = req.params; // Extract id from the request body
  const logo = req.file ? req.file.filename.split("/").pop() : null; // Get just the filename if uploaded
  const UpdateAdver = {};

  if (req.body.Name) UpdateAdver.Name = req.body.Name;
  if (req.body.Link) UpdateAdver.Link = req.body.Link;
  if (req.body.Hotline) UpdateAdver.Hotline = req.body.Hotline;
  if (req.body.Mail) UpdateAdver.Mail = req.body.Mail;
  if (req.body.Profile) UpdateAdver.Profile = req.body.Profile;
  if (req.body.Loc) UpdateAdver.Loc = req.body.Loc;
  if (req.body.CompanyDes) UpdateAdver.CompanyDes = req.body.CompanyDes;
  if (req.body.Services) UpdateAdver.Services = req.body.Services;
  if (logo) UpdateAdver.logo = logo; // Update logo if provided, saving only the filename

  try {
    const updateAdver = await adverModel.findByIdAndUpdate(id, UpdateAdver, {
      new: true,
    });
    if (!updateAdver) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    res.status(200).json(updateAdver);
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
  createAdver,
  getAdver,
  updateAdver,
  getAdverById,
  getAdvertiser,
  deleteAdver,
};
