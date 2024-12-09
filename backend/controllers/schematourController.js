const Schema = require("../models/schematour.js");
const User = require("../models/Tourist.js");
const TourGuide = require('../models/TGuide');
const sendEmailFlag = require('../utils/sendEmailFlag');
const { default: mongoose } = require("mongoose");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
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
    // Log the entire request query to check its contents
    console.log("Request Query Params:", req.query);

    let userId = req.query.userId;

    // Log the received User ID
    console.log("Received User ID:", userId);

    // Validate userId
    if (!userId || !mongoose.isValidObjectId(userId.trim())) {
      return res.status(400).json({ message: "Invalid or missing User ID." });
    }

    // Trim any whitespace or newline characters from the user ID
    userId = userId.trim();

    // Find active tours or tours booked by the user
    const schemas = await Schema.find({
      $or: [
        { isActive: true }, // Active tours
        { bookedUsers: userId }, // Tours booked by the user
      ],
    })
      .populate("activities")
      .populate("Tags", "name");

    // Add booking status for each tour
    const toursWithBookingStatus = schemas.map((tour) => ({
      ...tour.toObject(),
      isBooked: tour.bookedUsers.includes(userId), // Check if the user has booked this tour
    }));

    res.status(200).json(toursWithBookingStatus);
  } catch (err) {
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
  const { userId, paymentMethod } = req.body;

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

    if (paymentMethod === "card") {
      // Create a PaymentIntent for the card payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: schema.TourPrice*100, // Convert price to cents
        currency: "usd", // Currency code
        metadata: {
          tourId: id, // Pass the itinerary ID
          userId: userId, // Pass the user ID
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
    
      if (user.Wallet < schema.TourPrice) {
        return res.status(400).json({
          message: "Insufficient wallet balance. Please top up your wallet.",
        });
      }

      // Deduct the activity price from the user's wallet
      user.Wallet -= schema.TourPrice;
      await user.save(); // Save the updated user balance

      schema.bookedUsers.push(userId);
      schema.bookings += 1;
      await schema.save();

    

      return res.status(200).json({ message: "Tour booked successfully using wallet." });
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

// Update Guide
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
// Add to the Controller

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
    await schema.cancelBooking(userId);

    // // Retrieve the user from the database using the userId
    // const user = await User.findById(userId); // Assuming you have a User model

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // // Use the existing calculateLoyaltyPoints function
    // const loyaltyPoints = calculateLoyaltyPoints(
    //   user.Loyalty_Level,
    //   schema.TourPrice
    // );

    // // Add loyalty points to the user's account
    // user.Loyalty_Points = user.Loyalty_Points - loyaltyPoints;
    // user.Total_Loyalty_Points = user.Total_Loyalty_Points - loyaltyPoints;

    // if (user.Total_Loyalty_Points >= 500000) {
    //   user.Loyalty_Level = 3;
    // } else if (user.Total_Loyalty_Points >= 100000) {
    //   user.Loyalty_Level = 2;
    // } else {
    //   user.Loyalty_Level = 1;
    // }
    // // Save the updated user record
    // await user.save();

    res.status(200).json({
      message: "Booking canceled successfully",
      bookings: schema.bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const getItineraryTouristReport = async (req, res) => {
  const { tourGuideId } = req.params; // Get the Tour Guide ID from request parameters
  const { month } = req.query; // Get the month from query parameters (1 for January, 12 for December)

  try {
    console.log("Received tour Guide ID:", tourGuideId); // Log the tourGuideId for debugging

    // Validate tourGuideId format
    if (!mongoose.Types.ObjectId.isValid(tourGuideId)) {
      console.log("Invalid tourGuide ID format.");
      return res.status(400).json({ message: "Invalid tourGuide ID." });
    }

    // Verify Tour Guide exists
    const tgExists = await TourGuide.findById(tourGuideId);
    if (!tgExists) {
      console.log("Tour Guide not found.");
      return res.status(404).json({ message: "Tour Guide not found." });
    }

    // Fetch all itineraries related to the specific tour guide
    let itineraries = await Schema.find({ tourGuide: tourGuideId });

    if (itineraries.length === 0) {
      console.log("No itineraries found for this tour guide.");
      return res.status(404).json({ message: "No itineraries found for this tour guide." });
    }

    // If month is provided, filter itineraries by the month of availableDates
    if (month) {
      itineraries = itineraries.filter((itinerary) => {
        return itinerary.availableDates.some((date) => {
          const itineraryMonth = new Date(date).getMonth() + 1; // Get month (0-based, so +1)
          return itineraryMonth === parseInt(month);
        });
      });
    }

    // Calculate the total number of tourists across all itineraries
    const totalTourists = itineraries.reduce((total, itinerary) => total + itinerary.bookedUsers.length, 0);

    // Prepare the itinerary details for the response
    const itineraryDetails = itineraries.map(({ _id, name, bookings, bookedUsers }) => ({
      itineraryId: _id,
      name,
      bookings,
      totalBookings: bookedUsers.length, // Count the number of booked users for each itinerary
    }));

    // Send the response with the total number of tourists and itinerary details
    res.status(200).json({
      tourGuideId,
      totalTourists,
      itineraryDetails,
    });
  } catch (error) {
    console.error("Error fetching report:", error.message);
    res.status(500).json({ message: "Error fetching itinerary tourist report", error: error.message });
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
  toggleActivation,
  cancelBooking,
  submitReview,
  getBookedItineraries,
  getIteneraries,
  finalizeBooking,
  getItineraryTouristReport
};
