const { default: mongoose } = require("mongoose");
const express = require('express');
const router = express.Router();
const HistoricalPlace = require('../models/HistoricalPlaceCRUD');
const TourismGovernerTag = require('../models/tourismGovernerTags'); // Import the tourismGovernerTag model
const User = require("../models/Tourist.js");


// Create a Historical Place with tourismGovernerTags reference
const createHistoricalPlace = async (req, res) => {
  try {
    const { description, pictures, location, openingHours, foreignerTicketPrice, nativeTicketPrice, studentTicketPrice, tourismGovernerTags} = req.body;

    // Find the tourismGovernerTags (this ensures you're referencing valid tags)
    const tag = await TourismGovernerTag.findById(tourismGovernerTags);
    if (!tag) {
      return res.status(400).json({ error: 'Invalid tourism governer tag' });
    }

    // Create the historical place
    const historicalPlace = await HistoricalPlace.create({
      description,
      pictures,
      location,
      openingHours,
      foreignerTicketPrice,
      nativeTicketPrice,
      studentTicketPrice,
      tourismGovernerTags: tag._id ,// Reference the tourismGovernerTags by _id
      
    });

    res.status(201).json(historicalPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
function calculateLoyaltyPoints(level, price) {
  let points = 0;

  if (level === 1) {
    points = price * 0.5;
  } else if (level === 2) {
    points = price * 1;
  } else if (level === 3) {
    points = price * 1.5;
  }

  console.log(`Points calculated for level ${level}: ${points}`); // Log calculated points
  return points;
}

const getBookedHP = async (req, res) => {
  try {
    const { touristId } = req.query;
    // Validate touristId
    if (!touristId || !mongoose.isValidObjectId(touristId.trim())) {
      return res.status(400).json({ message: "Invalid or missing Tourist ID." });
    }
    // Find all itineraries that the tourist has booked
    const bookedHP = await HistoricalPlace.find({
      bookedUsers: touristId.trim(),
    })
   
    // Respond with the list of booked itineraries
    res.status(200).json(bookedHP);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const bookHP = async (req, res) => {
  const { id } = req.params; // Extract the activity ID from the URL parameters
  const userId = req.body.userId; // Extract the user ID from the request body

  // Log incoming parameters for debugging
  console.log("Incoming ID:", id);
  console.log("Incoming User ID:", userId);

  // Check if ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Activity ID." });
  }

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const HP = await HistoricalPlace.findById(id); // Find the activity by its ID
    if (!HP) {
      return res.status(404).json({ message: "Activity not found." });
    }
    const user = await User.findById(userId); // Assuming you have a User model

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Increment bookings if the user has not already booked
    await HP.incrementBookings(userId);

    // Retrieve the user from the database using the userId
    

    // Use the existing calculateLoyaltyPoints function
    const loyaltyPoints = calculateLoyaltyPoints(
      user.Loyalty_Level,
      HP.foreignerTicketPrice
    );

    // Add loyalty points to the user's account
    user.Loyalty_Points += loyaltyPoints;

    if (user.Loyalty_Points >= 500000) {
      user.Loyalty_Level = 3;
    } else if (user.Loyalty_Points >= 100000) {
      if (user.Loyalty_Level <= 2) {
        user.Loyalty_Level = 2;
      }
    } else {
      if (user.Loyalty_Level <= 1) {
        user.Loyalty_Level = 1;
      }
    }
    // Save the updated user record
    await user.save();

    res.status(200).json({
      message: "Booking successful",
      bookings: HP.bookings,
      earnedPoints: loyaltyPoints, // Include the points earned in the response
      totalLoyaltyPoints: user.Loyalty_Points, // Include total points in the response
    });
  } catch (error) {
    console.error("Error during booking:", error); // Log error to console for debugging
    if (error.message.includes("already booked")) {
      return res
        .status(400)
        .json({ message: "You have already booked this activity." });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message }); // Send the error message in response
  }
};

const submitReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  const { HPId } = req.params;

  console.log("Received activityId:", activityId); // Debugging line

  try {
    // Find the activity by its ID
    const HP = await HistoricalPlace.findById(HPId);
    if (!HP) {
      console.log("Activity not found"); // Debugging line
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Add the review to the activity
    HP.reviews.push({ userId, rating, comment });

    // Calculate the new average rating for the activity
    const totalRatings = HP.reviews.reduce((sum, review) => sum + review.rating, 0);
    HP.rating = totalRatings / HP.reviews.length;

    // Save the updated activity
    await HP.save();

    return res.status(200).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error("Error while submitting review:", error); // Debugging line
    return res.status(500).json({ message: 'Server error' });
  }
};

const cancelHP = async (req, res) => {
  let { id } = req.params;
  const userId = req.body.userId;

  // Trim and validate the id parameter
  id = id.trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid itinerary ID format" });
  }

  try {
    const HP = await HistoricalPlace.findById(id);
    if (!HP) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Attempt to cancel the booking
    await HP.cancelBooking(userId);

    res.status(200).json({ message: "Booking canceled successfully", bookings: HistoricalPlace.bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all Historical Places with populated tourismGovernerTags
const getHistoricalPlace = async (req, res) => {
  try {
    // Use .populate to fill the tourismGovernerTags field with actual data
    const historicalPlaces = await HistoricalPlace.find().populate('tourismGovernerTags','name type');
    res.status(200).json(historicalPlaces);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getHistoricalPlaceById = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the historical place by ID and populate the tourismGovernerTags field
    const historicalPlace = await HistoricalPlace.findById(id).populate('tourismGovernerTags', 'name type');

    if (!historicalPlace) {
      return res.status(404).json({ error: "Historical place not found" });
    }

    res.status(200).json(historicalPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Historical Place (including tourismGovernerTags if provided)
const updateHistoricalPlace = async (req, res) => {
  const { id } = req.params; // Extract id from the request parameters
  const updateData = {}; // Initialize an empty object for updates

  // Only add fields to updateData if they exist in the request body
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.pictures) updateData.pictures = req.body.pictures;
  if (req.body.location) updateData.location = req.body.location;
  if (req.body.openingHours) updateData.openingHours = req.body.openingHours;
  if (req.body.foreignerTicketPrice) updateData.foreignerTicketPrice = req.body.foreignerTicketPrice;
  if (req.body.nativeTicketPrice) updateData.nativeTicketPrice = req.body.nativeTicketPrice;
  if (req.body.studentTicketPrice) updateData.studentTicketPrice = req.body.studentTicketPrice;

  // Handle updating the tourismGovernerTags field
  if (req.body.tourismGovernerTags) {
    const tag = await TourismGovernerTag.findById(req.body.tourismGovernerTags);
    if (!tag) {
      return res.status(400).json({ error: 'Invalid tourism governer tag' });
    }
    updateData.tourismGovernerTags = tag._id;
  }

  try {
    const updatedHistoricalPlace = await HistoricalPlace.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensure validators run on updates
    );

    if (!updatedHistoricalPlace) {
      return res.status(404).json({ error: "Historical place not found" });
    }

    res.status(200).json(updatedHistoricalPlace); // Send updated historical place as response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Historical Place
const deleteHistoricalPlace = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHistoricalPlace = await HistoricalPlace.findByIdAndDelete(id);
    if (!deletedHistoricalPlace) {
      return res.status(404).json({ error: "Historical place not found" });
    }
    res.status(200).json({ message: "Historical place deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAllHistoricalPlaces = async (req, res) => {
  try {
    console.log("Attempting to delete all HistoricalPlaces...");
    await HistoricalPlace.deleteMany({});
    console.log("All HistoricalPlaces deleted successfully.");
    res.status(200).json({ message: 'All HistoricalPlaces have been deleted' });
  } catch (error) {
    console.error("Error deleting HistoricalPlaces:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createHistoricalPlace,
  getHistoricalPlace,
  updateHistoricalPlace,
  deleteHistoricalPlace,
  deleteAllHistoricalPlaces,
  getHistoricalPlaceById,
  bookHP,
  getBookedHP,
  cancelHP,
  submitReview
};