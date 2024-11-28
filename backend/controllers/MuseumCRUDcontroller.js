const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const Museum = require("../models/MuseumCRUD"); // Assuming you have Museum model like HistoricalPlaceCRUD
const TourismGovernerTag = require("../models/tourismGovernerTags"); // Import the tourismGovernerTag model
const User = require("../models/Tourist.js");
const sendEmailFlag = require('../utils/sendEmailFlag');

// CRUD operations

// Create a Museum with tourismGovernerTags reference
const createMuseum = async (req, res) => {
  try {
    const {
      description,
      pictures,
      location,
      openingHours,
      foreignerTicketPrice,
      nativeTicketPrice,
      studentTicketPrice,
      tourismGovernerTags,
    } = req.body;

    // Find the tourismGovernerTags (this ensures you're referencing valid tags)
    const tag = await TourismGovernerTag.findById(tourismGovernerTags);
    if (!tag) {
      return res.status(400).json({ error: "Invalid tourism governer tag" });
    }

    // Create the museum
    const museum = await Museum.create({
      description,
      pictures,
      location,
      openingHours,
      foreignerTicketPrice,
      nativeTicketPrice,
      studentTicketPrice,
      tourismGovernerTags: tag._id, // Reference the tourismGovernerTags by _id
    });

    res.status(201).json(museum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch all Museums with populated tourismGovernerTags
const getMuseum = async (req, res) => {
  try {
    // Populate both 'name' and 'type' fields from tourismGovernerTags
    const museums = await Museum.find().populate(
      "tourismGovernerTags",
      "name type"
    ); // Populate specific fields ('name' and 'type')
    res.status(200).json(museums);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch a single Museum by ID with populated tourismGovernerTags
const getMuseumById = async (req, res) => {
  const { id } = req.params; // Extract the museum ID from request parameters
  try {
    const museum = await Museum.findById(id).populate(
      "tourismGovernerTags",
      "name type"
    );
    if (!museum) {
      return res.status(404).json({ error: "Museum not found" });
    }
    res.status(200).json(museum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Museum (including tourismGovernerTags if provided)
const updateMuseum = async (req, res) => {
  const { id } = req.params; // Extract id from the request parameters
  const updateData = {}; // Initialize an empty object for updates

  // Only add fields to updateData if they exist in the request body
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.pictures) updateData.pictures = req.body.pictures;
  if (req.body.location) updateData.location = req.body.location;
  if (req.body.openingHours) updateData.openingHours = req.body.openingHours;
  if (req.body.foreignerTicketPrice)
    updateData.foreignerTicketPrice = req.body.foreignerTicketPrice;
  if (req.body.nativeTicketPrice)
    updateData.nativeTicketPrice = req.body.nativeTicketPrice;
  if (req.body.studentTicketPrice)
    updateData.studentTicketPrice = req.body.studentTicketPrice;

  // Handle updating the tourismGovernerTags field
  if (req.body.tourismGovernerTags) {
    const tag = await TourismGovernerTag.findById(req.body.tourismGovernerTags);
    if (!tag) {
      return res.status(400).json({ error: "Invalid tourism governer tag" });
    }
    updateData.tourismGovernerTags = tag._id;
  }

  try {
    const updatedMuseum = await Museum.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensure validators run on updates
    );

    if (!updatedMuseum) {
      return res.status(404).json({ error: "Museum not found" });
    }

    res.status(200).json(updatedMuseum); // Send updated museum as response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const bookm = async (req, res) => {
  const { id } = req.params; // Extract the activity ID from the URL parameters
  const userId = req.body.userId; // Extract the user ID from the request body

  // Check if ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Activity ID." });
  }

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const HP = await Museum.findById(id); // Find the activity by its ID
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
    user.Loyalty_Points = user.Loyalty_Points + loyaltyPoints;
    user.Total_Loyalty_Points = user.Total_Loyalty_Points + loyaltyPoints;

    if (user.Total_Loyalty_Points >= 500000) {
      user.Loyalty_Level = 3;
    } else if (user.Total_Loyalty_Points >= 100000) {
      user.Loyalty_Level = 2;
    } else {
      user.Loyalty_Level = 1;
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

const cancelHP = async (req, res) => {
  let { id } = req.params;
  const userId = req.body.userId;

  // Trim and validate the id parameter
  id = id.trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid itinerary ID format" });
  }

  try {
    const HP = await Museum.findById(id);
    if (!HP) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Attempt to cancel the booking
    await HP.cancelBooking(userId);

    res.status(200).json({
      message: "Booking canceled successfully",
      bookings: Museum.bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookedHP = async (req, res) => {
  try {
    const { touristId } = req.query;
    // Validate touristId
    if (!touristId || !mongoose.isValidObjectId(touristId.trim())) {
      return res
        .status(400)
        .json({ message: "Invalid or missing Tourist ID." });
    }
    // Find all itineraries that the tourist has booked
    const bookedHP = await Museum.find({
      bookedUsers: touristId.trim(),
    })
    .populate('tourismGovernerTags', 'name type');  // Populate specific fields ('name' and 'type')

    // Respond with the list of booked itineraries
    res.status(200).json(bookedHP);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const submitReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  const { HPId } = req.params;

  console.log("Received activityId:", HPId); // Debugging line

  try {
    // Find the activity by its ID
    const HP = await Museum.findById(HPId);
    if (!HP) {
      console.log("Activity not found"); // Debugging line
      return res.status(404).json({ message: "Activity not found" });
    }

    // Add the review to the activity
    HP.reviews.push({ userId, rating, comment });

    // Calculate the new average rating for the activity
    const totalRatings = HP.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    HP.rating = totalRatings / HP.reviews.length;

    // Save the updated activity
    await HP.save();

    return res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error while submitting review:", error); // Debugging line
    return res.status(500).json({ message: "Server error" });
  }
};
// Delete a Museum
const deleteMuseum = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMuseum = await Museum.findByIdAndDelete(id);
    if (!deletedMuseum) {
      return res.status(404).json({ error: "Museum not found" });
    }
    res.status(200).json({ message: "Museum deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAllMuseums = async (req, res) => {
  try {
    console.log("Attempting to delete all Museums...");
    await Museum.deleteMany({});
    console.log("All Museums deleted successfully.");
    res.status(200).json({ message: "All Museums have been deleted" });
  } catch (error) {
    console.error("Error deleting Museums:", error);
    res.status(500).json({ error: error.message });
  }
};


// Flag a Museum
const flagMuseum = async (req, res) => {
  const { id } = req.params;

  try {
    // Update the 'flagged' status to true
    const updatedMuseum = await Museum.findByIdAndUpdate(
      id,
      { flagged: true },
      { new: true }
    );

    if (!updatedMuseum) {
      return res.status(404).json({ message: "Museum not found" });
    }

    // Send email to the specified email address
    const recipientEmail = "marwanallam8@gmail.com";
    const subject = "A museum has been flagged";
    const text = `Dear User, the museum with the following description has been flagged: ${updatedMuseum.description}`;

    await sendEmailFlag(recipientEmail, subject, text);

    const notificationMessage = `The Museum with Description ${updatedMuseum.description} has been flagged.`;
    updatedMuseum.Notifications.push(notificationMessage);
    await updatedMuseum.save();

    res.status(200).json(updatedMuseum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMuseum,
  getMuseum,
  updateMuseum,
  deleteMuseum,
  deleteAllMuseums,
  flagMuseum,
  getMuseumById,
  bookm,
  getBookedHP,
  cancelHP,
  submitReview,
};
