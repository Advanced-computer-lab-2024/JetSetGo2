const Schema = require("../models/schematour.js");
const User = require("../models/Tourist.js");
const TourGuide = require('../models/TGuide');
const sendEmailFlag = require('../utils/sendEmailFlag');
const { default: mongoose } = require("mongoose");
const sendNotificationEmails = require("../utils/tabbakh");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const validatePromoCode = require("./promoCodeController.js").validatePromoCode; // Ensure you import the validation function


const createGuide = async (req, res) => {
  const {
    name,
    activities,
    locations,
    timeline,
    durationActivity,
    tourLanguage,
    TourPrice,
    availableDates,
    accessibility,
    pickUpLoc,
    DropOffLoc,
    tourGuide,
    Tags,
    rating,
    isActive, // Include isActive
    isActive1
  } = req.body;

  const newSchema = new Schema({
    name,
    activities,
    locations,
    timeline,
    durationActivity,
    tourLanguage,
    TourPrice,
    availableDates,
    accessibility,
    pickUpLoc,
    DropOffLoc,
    tourGuide,
    Tags,
    rating,
    isActive, // Add isActive field
    isActive1
  });

  try {
    const savedSchema = await newSchema.save();
    res.status(200).json(savedSchema);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getItineraryById = async (req, res) => {
  const { id } = req.params; // Extract the itinerary ID from the request parameters
  try {
    console.log("Itenray id", id);
    const itinerary = await Schema.findById(id)
      .populate("activities")
      .populate("Tags", "name");

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json(itinerary); // Send the found itinerary
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const readGuide = async (req, res) => {
  try {
    console.log("Request Query Params:", req.query);

    const userId = req.query.userId;

    // Validate the User ID if provided
    if (userId && !mongoose.isValidObjectId(userId.trim())) {
      return res.status(400).json({ message: "Invalid User ID." });
    }

    // Fetch all itineraries without restrictions
    const schemas = await Schema.find()
      .populate("activities")
      .populate("Tags", "name");

    // If a user ID is provided, add booking status for each itinerary
    const toursWithBookingStatus = userId
      ? schemas.map((tour) => ({
          ...tour.toObject(),
          isBooked: tour.bookedUsers.includes(userId.trim()), // Check if the user has booked this tour
        }))
      : schemas.map((tour) => tour.toObject()); // If no user ID, return itineraries as is

    res.status(200).json(toursWithBookingStatus);
  } catch (err) {
    console.error("Error in readGuide:", err.message);
    res.status(500).json({ message: err.message });
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

const bookTour = async (req, res) => {
  const { id } = req.params; // Tour ID
  const { userId, paymentMethod, promoCode } = req.body;

  try {
    // Find the itinerary to be booked
    const schema = await Schema.findById(id);
    if (!schema) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Check if the user has already booked this itinerary
    if (schema.bookedUsers.includes(userId)) {
      return res.status(400).json({ message: "You have already booked this tour." });
    }

    // Find the user attempting to book the tour
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the price
    let discountedPrice = schema.TourPrice;

    // Validate and apply promo code (if provided)
    if (promoCode) {
      const validation = await validatePromoCode(promoCode);

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const { discountType, discountValue } = validation;

      // Apply the discount
      if (discountType === "percentage") {
        discountedPrice = schema.TourPrice - (schema.TourPrice * discountValue) / 100;
      } else if (discountType === "fixed") {
        discountedPrice = schema.TourPrice - discountValue;
      }

      // Ensure discounted price is not less than zero
      if (discountedPrice < 0) discountedPrice = 0;

      console.log(`Promo code applied. Discounted price: ${discountedPrice}`);
    }

    if (paymentMethod === "card") {
      // Create a PaymentIntent for the card payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(discountedPrice * 100), // Convert price to cents
        currency: "usd", // Currency code
        metadata: {
          tourId: id, // Pass the itinerary ID
          userId: userId, // Pass the user ID
          promoCode: promoCode || "N/A", // Include promo code in metadata
          type: "itinerary", // Optional type field
        },
      });

      console.log("Generated PaymentIntent client_secret:", paymentIntent.client_secret);

      // Send the `client_secret` to the frontend
      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: "Payment initiated. Confirm payment on the frontend.",
      });
    } else if (paymentMethod === "wallet") {
      // Check if the user has sufficient wallet balance
      if (user.Wallet < discountedPrice) {
        return res.status(400).json({
          message: "Insufficient wallet balance. Please top up your wallet.",
        });
      }

      // Deduct the activity price from the user's wallet
      user.Wallet -= discountedPrice;
      await user.save(); // Save the updated user balance

      // Update the itinerary with the booking details
      schema.bookedUsers.push(userId);
      schema.bookings += 1;
      await schema.save();

      return res.status(200).json({
        message: "Tour booked successfully using wallet.",
        discountedPrice,
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Error in bookTour:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const finalizeBooking = async (req, res) => {
  const { id } = req.params;
  const { userId} = req.body;

  try {
    const schema = await Schema.findById(id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!schema) {
      return res.status(404).json({ message: "Itinerary not found." });
    }
    if (schema.bookedUsers.includes(userId)) {
      return res.status(400).json({ message: "You have already booked this tour." });
    }
    schema.bookedUsers.push(userId);

    // Update booking status
    schema.isBooked = true;
    schema.bookings += 1; // Increment bookings count
    await schema.save();
    user.Loyalty_Points += calculateLoyaltyPoints(user.Loyalty_Level, schema.TourPrice);
      await user.save();
    res.status(200).json({ message: "Booking finalized successfully." });
  } catch (error) {
    console.error("Error finalizing booking:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Toggle Activation
const toggleActivation = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim(); // Clean the ID

    const itinerary = await Schema.findById(cleanId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Prevent deactivation if it is active and has no bookings
    if (itinerary.isActive && itinerary.bookings === 0) {
      return res.status(400).json({
        message: "Itinerary cannot be deactivated because it has no bookings.",
      });
    }

    // Toggle the activation status
    itinerary.isActive = !itinerary.isActive;
    await itinerary.save();

    if (itinerary.isActive) {
      return res
        .status(200)
        .json({ message: "Itinerary activated", itinerary });
    } else {
      return res
        .status(200)
        .json({ message: "Itinerary deactivated", itinerary });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read Guide by ID
const readGuideID = async (req, res) => {
  try {
    const userId = req.query.userId;
    const schemas = await Schema.find({
      tourGuide: new mongoose.Types.ObjectId(userId),
    })
      .populate("activities")
      .populate("Tags", "name");
    res.status(200).json(schemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getIteneraries = async (req, res) => {
  try {
    const schema = await Schema.find()
      .populate("activities")
      .populate("Tags", "name");
    if (!schema) return res.status(404).json({ message: "schema not found" });
    res.status(200).json(schema);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateGuide = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  if (req.body.name) updateData.name = req.body.name;
  if (req.body.activities) updateData.activities = req.body.activities;
  if (req.body.locations) updateData.locations = req.body.locations;
  if (req.body.timeline) updateData.timeline = req.body.timeline;
  if (req.body.durationActivity)
    updateData.durationActivity = req.body.durationActivity;
  if (req.body.tourLanguage) updateData.tourLanguage = req.body.tourLanguage;
  if (req.body.TourPrice) updateData.TourPrice = req.body.TourPrice;
  if (req.body.availableDates)
    updateData.availableDates = req.body.availableDates;
  if (req.body.accessibility) updateData.accessibility = req.body.accessibility;
  if (req.body.pickUpLoc) updateData.pickUpLoc = req.body.pickUpLoc;
  if (req.body.DropOffLoc) updateData.DropOffLoc = req.body.DropOffLoc;
  if (req.body.Tags) updateData.Tags = req.body.Tags;
  if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive; // Allow toggling isActive

  try {
    const updatedGuide = await Schema.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedGuide) {
      return res.status(404).json({ error: "Guide not found" });
    }
    res.status(200).json(updatedGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteGuide = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Schema.findByIdAndDelete(id, { new: true });
    if (!deleted) return res.status(404).json({ message: "schema not found" });
    if (deleted.bookings > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete schema with existing bookings" });
    }

    res.status(200).json({ message: "schema deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const flagItinerary = async (req, res) => {
  const { id } = req.params; // Extract the itinerary ID from the URL

  try {
    // Find the itinerary by ID and update the 'flagged' status to true automatically
    const updatedSchema = await Schema.findByIdAndUpdate(
      id,
      { flagged: true }, // Automatically set 'flagged' to true
      { new: true } // Return the updated document
    );

    if (!updatedSchema) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Fetch the tour guide's ID from the itinerary
    const tourGuideId = updatedSchema.tourGuide;

    // Use the TourGuide model to get the tour guide's email
    const tourGuide = await TourGuide.findById(tourGuideId);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    const tourGuideEmail = tourGuide.Email; // Assuming the tour guide has an email field
    const subject = "Your itinerary has been flagged";
    const text = `Dear Tour Guide, your itinerary with name ${updatedSchema.name} has been flagged.`;

    await sendEmailFlag(tourGuideEmail, subject, text);
    const notificationMessage = `Your itinerary with name ${updatedSchema.name} has been flagged.`;

    // Push the notification to the tour guide's Notifications array
    tourGuide.Notifications.push(notificationMessage);
    await tourGuide.save();

    res.status(200).json(updatedSchema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleActivation1 = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim(); // Clean the ID

    console.log("Toggling activation for activity ID:", cleanId);

    // Fetch the activity and populate notificationRequests with email and UserName
    const activity = await Schema.findById(cleanId).populate(
      'notificationRequests',
      'Email UserName'
    );

    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Toggle the activation status
    activity.isActive1 = !activity.isActive1;
    await activity.save();

    // Send emails only if the status changes to active
    if (activity.isActive1) {
      console.log("Activity activated.");

      if (!activity.notificationRequests.length) {
        return res.status(200).json({
          message: "Activity activated, but no users to notify.",
          activity,
        });
      }

      const emailPromises = activity.notificationRequests.map((user) => {
        console.log(`Sending email to: ${user.UserName} (${user.Email})`); // Debugging log
        return sendNotificationEmails(
          user.Email,
          user.UserName,
          activity.name
        );
      });

      await Promise.all(emailPromises);
    }

    res.status(200).json({
      message: activity.isActive
        ? "Activity activated"
        : "Activity deactivated",
      activity,
    });
  } catch (error) {
    console.error("Error in toggleActivation:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const cancelBooking = async (req, res) => {
  let { id } = req.params;
  const userId = req.body.userId;

  // Trim and validate the id parameter
  id = id.trim(); // Remove any extra whitespace

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid itinerary ID format" });
  }

  try {
    const schema = await Schema.findById(id);
    if (!schema) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Attempt to cancel the booking
    const tourist = await User.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "User not found" });
    }
    const refundAmount = parseFloat(schema.TourPrice);
    if (isNaN(refundAmount)) {
      return res.status(400).json({ message: "Invalid refund amount." });
    }

    console.log("Refund amount:", refundAmount);

    tourist.Wallet += refundAmount;
    console.log("Wallet updated. New balance:", tourist.Wallet);
    await schema.cancelBooking(userId);

    // Remove the booking from the itinerary

    // Save the updated itinerary and tourist
    await schema.save();
    await tourist.save();

    res.status(200).json({
      message: "Booking canceled successfully. Refund processed.",
      refundAmount,
      walletBalance: tourist.Wallet,
      updatedBookings: schema.bookings,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};
const submitReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  const { itineraryId } = req.params;
  try {
    // Find the itinerary by its ID
    const itinerary = await Schema.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    // Add the review to the itinerary
    itinerary.reviews.push({ userId, rating, comment });
    // Calculate the new average rating for the itinerary
    const totalRatings = itinerary.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    itinerary.rating = totalRatings / itinerary.reviews.length;
    // Save the updated itinerary
    await itinerary.save();
    return res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getBookedItineraries = async (req, res) => {
  try {
    const { touristId } = req.query;
    // Validate touristId
    if (!touristId || !mongoose.isValidObjectId(touristId.trim())) {
      return res
        .status(400)
        .json({ message: "Invalid or missing Tourist ID." });
    }
    // Find all itineraries that the tourist has booked
    const bookedItineraries = await Schema.find({
      bookedUsers: touristId.trim(),
    })
      .populate("activities")
      .populate("Tags", "name");
    // Respond with the list of booked itineraries
    res.status(200).json(bookedItineraries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getBookedItineraries1 = async (req, res) => {
  const { tourGuideId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(tourGuideId)) {
      return res.status(400).json({ message: "Invalid tour guide ID." });
    }

    const itineraries = await Schema.find({ tourGuide: tourGuideId, bookings: { $gt: 0 } });

    if (!itineraries.length) {
      return res.status(404).json({ message: "No booked itineraries found." });
    }

    res.status(200).json(itineraries);
  } catch (error) {
    console.error("Error fetching booked itineraries:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const requestNotification = async (req, res) => {
  const { id } = req.params; // Itinerary ID
  const { userId } = req.body; // Tourist ID

  // Validate Itinerary ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Itinerary ID." });
  }

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID." });
  }

  try {
    // Fetch the itinerary
    const itinerary = await Schema.findById(id);

    // If itinerary does not exist
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Initialize notificationRequests array if it doesn't exist
    if (!Array.isArray(itinerary.notificationRequests)) {
      itinerary.notificationRequests = [];
    }

    // Check if the user has already requested notification
    if (itinerary.notificationRequests.includes(userId)) {
      return res.status(400).json({
        message: "You have already requested a notification for this itinerary.",
      });
    }

    // Add userId to notificationRequests array
    itinerary.notificationRequests.push(userId);
    await itinerary.save();

    res.status(200).json({ message: "Notification request added successfully." });
  } catch (error) {
    console.error(
      "Error adding notification request for itinerary:",
      id,
      "and user:",
      userId,
      error
    );
    res.status(500).json({ message: "Internal server error." });
  }
};

const getNotificationRequests = async (req, res) => {
  const { id } = req.params;

  // Log the received ID
  console.log("Fetching notification requests for Itinerary ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid Itinerary ID:", id);
    return res.status(400).json({ message: "Invalid Itinerary ID." });
  }

  try {
    // Attempt to find the itinerary
    const itinerary = await Schema.findById(id).populate(
      "notificationRequests", // Ensure this field exists in your schema
      "Email" // Populate user fields
    );

    // Log what we fetched from the database
    console.log("Fetched itinerary:", itinerary);

    if (!itinerary) {
      console.error("Itinerary not found for ID:", id);
      return res.status(404).json({ message: "Itinerary not found." });
    }

    // Check if `notificationRequests` is populated correctly
    if (!itinerary.notificationRequests) {
      console.warn("No notification requests found.");
      return res.status(200).json([]);
    }

    res.status(200).json(itinerary.notificationRequests);
  } catch (error) {
    console.error("Error fetching notification requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getBookedItinerariesByTourGuide = async (req, res) => {
  const { tourGuideId } = req.params;

  try {
    // Fetch itineraries created by the tour guide that have bookings
    const bookedItineraries = await Schema.find({
      tourGuide: tourGuideId,
      bookings: { $gt: 0 }, // Only fetch itineraries with bookings
    });

    // Calculate total revenue
    const totalRevenue = bookedItineraries.reduce((total, itinerary) => {
      const itineraryRevenue = Math.min(...itinerary.TourPrice) * itinerary.bookings * 0.9;
      return total + itineraryRevenue;
    }, 0);
    console.log(itineraries);

    res.status(200).json({
      bookedItineraries,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching booked itineraries:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};







module.exports = {
  
  createGuide,
  readGuide,
  readGuideID,
  updateGuide,
  deleteGuide,
  bookTour,
  getItineraryById,
  flagItinerary,
  toggleActivation1,
  toggleActivation,
  cancelBooking,
  submitReview,
  getBookedItineraries,
  getBookedItineraries1,
  getIteneraries,
  getNotificationRequests,
  requestNotification,
  finalizeBooking,
  getBookedItinerariesByTourGuide
};
