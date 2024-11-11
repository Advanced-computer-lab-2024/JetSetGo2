const express = require("express");
const multer = require("multer");
const router = express.Router();
const TourModel = require("../models/TGuide.js");
const ItenModel = require("../models/schematour.js");
const { ProfilingLevel } = require("mongodb");

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    UserName,
    Email,
    Password,
    Age,
    LanguagesSpoken,
    MobileNumber,
    YearsOfExperience,
    PreviousWork,
  } = req.body;
  const base64Image = req.body.pictures.replace(
    /^data:image\/[a-zA-Z]+;base64,/,
    ""
  );
  const Photo = base64Image; // Get just the filename if uploaded

  try {
    const updateFields = {};
    if (UserName) updateFields.UserName = UserName;
    if (Password) updateFields.Password = Password;
    if (Email) updateFields.Email = Email;
    if (Age) updateFields.Age = Age;
    if (LanguagesSpoken) updateFields.LanguagesSpoken = LanguagesSpoken;
    if (MobileNumber) updateFields.MobileNumber = MobileNumber;
    if (YearsOfExperience) updateFields.YearsOfExperience = YearsOfExperience;
    if (PreviousWork) updateFields.PreviousWork = PreviousWork;
    if (Photo) updateFields.Photo = Photo; // Update logo if provided, saving only the filename

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
      tourGuide = await TourModel.findById(id);

      if (!tourGuide) {
        return res.status(404).json({ error: "Tour guide not found" });
      }
    } else {
      // If no ID is provided, find all tour guides
      tourGuide = await TourModel.find(); // Retrieve all tour guides
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
const createUser = async (req, res) => {
  //add a new user to the database with
  //Name, Email and Age
  const {
    Name,
    Email,
    Age,
    LanguagesSpoken,
    MobileNumber,
    YearsOfExperience,
    PreviousWork,
  } = req.body;
  try {
    const user = await TourModel.create({
      Name,
      Email,
      Age,
      LanguagesSpoken,
      MobileNumber,
      YearsOfExperience,
      PreviousWork,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const submitReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  const { tourGuideId } = req.params;

  try {
    // Find the tour guide by ID and add the review directly to the reviews array
    const tourGuide = await Tour.findById(tourGuideId);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    // Add review to the array
    tourGuide.reviews.push({ userId, rating, comment });

    // Calculate the new average rating
    const totalRatings = tourGuide.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    tourGuide.rating = totalRatings / tourGuide.reviews.length;

    // Save the document
    await tourGuide.save();

    return res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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

const rejectTourguide = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the seller by ID and delete it
    const acceptTourguide = await TourModel.findByIdAndUpdate(id, {
      Admin_Acceptance: false,
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

const reqAccountToBeDeleted = async (req, res) => {
  const { id } = req.params;
  const currentDate = new Date();

  try {
    const itineraries = await ItenModel.find({
      tourGuide: id,
      availableDates: { $gt: currentDate }, // Date is greater than the current date
      bookings: { $gt: 0 },
    }).populate("tourGuide");

    if (itineraries.length == 0) {
      const tourguide = await TourModel.findByIdAndDelete(id);
      const deleteditenaries = await ItenModel.deleteMany({ tourGuide: id });
    } else {
      return res.status(400).json({
        message: "cannot be deleted there are upcoming itenaries booked",
      });
    }

    res.status(200).json({
      message: "tourguide deleted succesfully along with its itenaries",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching itineraries", error });
  }
};

module.exports = {
  getuser,
  updateUser,
  getUserById,
  deleteTGuide,
  acceptTourguide,
  reqAccountToBeDeleted,
  submitReview,
  rejectTourguide,
};
