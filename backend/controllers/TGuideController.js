const express = require("express");
const multer = require("multer");
const router = express.Router();
const Tour = require("../models/TGuide");
const TourModel = require("../models/TGuide.js");
const { ProfilingLevel } = require("mongodb");

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    Name,
    Password,
    MobileNumber,
    Age,
    PreviousWork,
    YearsOfExperience,
    LanguagesSpoken,
    Email,
  } = req.body;
  const imageFile = req.file ? req.file.filename.split("/").pop() : null; // Store the full path of the uploaded file

  try {
    const updateFields = {};
    if (Name) updateFields.Name = Name;
    if (Password) updateFields.Password = Password;
    if (MobileNumber) updateFields.MobileNumber = MobileNumber;
    if (Age) updateFields.Age = Age;
    if (PreviousWork) updateFields.PreviousWork = PreviousWork;
    if (YearsOfExperience) updateFields.YearsOfExperience = YearsOfExperience;
    if (LanguagesSpoken) updateFields.LanguagesSpoken = LanguagesSpoken;
    if (Email) updateFields.Email = Email;
    if (imageFile) updateFields.Photo = imageFile; // Save the full path of the photo if uploaded

    const updatedTourGuide = await TourModel.findByIdAndUpdate(
      id,
      { $set: updateFields, Profile_Completed: true },
      { new: true } // Return the updated document
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    res.status(200).json(updatedTourGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Method to get all tour guides or a specific one by ID
const getuser = async (req, res) => {
  const { id } = req.params; // Extract the tour guide ID from the URL if provided

  try {
    let tourGuide;

    if (id) {
      // If an ID is provided, find that specific tour guide
      tourGuide = await Tour.findById(id);

      if (!tourGuide) {
        return res.status(404).json({ error: "Tour guide not found" });
      }
    } else {
      // If no ID is provided, find all tour guides
      tourGuide = await Tour.find(); // Retrieve all tour guides
    }

    res.status(200).json(tourGuide); // Send back the data
  } catch (error) {
    res.status(400).json({ error: error.message }); // Handle any errors
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const tourist = await TourModel.findById(id);
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTGuide = async (req, res) => {
  console.log("Request to delete tourism guide:", req.params.id); // Log the ID
  try {
    const { id } = req.params;
    const deletedTGuide = await TourModel.findByIdAndDelete(id);

    if (!deletedTGuide) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedTGuide,
    });
  } catch (error) {
    console.error("Error deleting tourism governor:", error);
    res.status(500).json({
      message: "Error deleting user",
      error,
    });
  }
};

const acceptTourguide = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the seller by ID and delete it
    const acceptTourguide = await TourModel.findByIdAndUpdate(id, {
      Admin_Acceptance: true,
    });

    if (!acceptTourguide) {
      return res.status(404).json({ message: "Seller is accepted/rejected" });
    }

    // Respond with a success message
    res.status(200).json({
      message: "Tourguide deleted successfully",
      seller: acceptTourguide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Tourguide",
      error,
    });
  }
};

module.exports = {
  getuser,
  updateUser,
  getUserById,
  deleteTGuide,
  acceptTourguide,
};
