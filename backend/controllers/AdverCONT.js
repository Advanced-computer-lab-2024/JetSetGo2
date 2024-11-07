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
  const { id } = req.params; // Extract id from the request body
  const { UserName, Email, Link, Hotline, Profile, Loc, CompanyDes, Services } =
    req.body; // Extract data from the
  const logo = req.file ? req.file.filename.split("/").pop() : null; // Get just the filename if uploaded

  try {
    const UpdateAdver = {};

    if (UserName) UpdateAdver.UserName = UserName;
    if (req.body.Password) UpdateAdver.Password = req.body.Password;
    if (Email) UpdateAdver.Email = Email;
    if (Link) UpdateAdver.Link = Link;
    if (Hotline) UpdateAdver.Hotline = Hotline;
    if (Profile) UpdateAdver.Profile = Profile;
    if (Loc) UpdateAdver.Loc = Loc;
    if (CompanyDes) UpdateAdver.CompanyDes = CompanyDes;
    if (Services) UpdateAdver.Services = Services;
    if (logo) UpdateAdver.logo = logo; // Update logo if provided, saving only the filename

    const Adver = await adverModel.findByIdAndUpdate(
      id,
      { $set: UpdateAdver, Profile_Completed: true },
      { new: true }
    );
    if (!Adver) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    res.status(200).json(Adver);
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

const acceptAdver = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the seller by ID and delete it
    const acceptAdver = await adverModel.findByIdAndUpdate(id, {
      Admin_Acceptance: true,
    });

    if (!acceptAdver) {
      return res.status(404).json({ message: "Seller is accepted/rejected" });
    }

    // Respond with a success message
    res.status(200).json({
      message: "Seller deleted successfully",
      seller: acceptAdver,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting seller",
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
  acceptAdver,
};
