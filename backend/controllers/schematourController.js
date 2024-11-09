const Schema = require("../models/schematour.js");
const { default: mongoose } = require("mongoose");

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
        { bookedUsers: userId },  // Tours booked by the user
      ],
    })
      .populate("activities")
      .populate("Tags", "name");

    // Add booking status for each tour
    const toursWithBookingStatus = schemas.map(tour => ({
      ...tour.toObject(),
      isBooked: tour.bookedUsers.includes(userId), // Check if the user has booked this tour
    }));

    res.status(200).json(toursWithBookingStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const bookTour = async (req, res) => {
  const { id } = req.params; // Extract the tour ID from the URL parameters
  const userId = req.body.userId; // Get userId from the request body (can come from the frontend or authenticated session)

  try {
    const schema = await Schema.findById(id);
    if (!schema) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Increment the bookings count if the user has not booked this tour before
    await schema.incrementBookings(userId);

    res
      .status(200)
      .json({ message: "Booking successful", bookings: schema.bookings });
  } catch (error) {
    if (error.message === "User has already booked this tour.") {
      return res.status(409).json({ message: error.message });  // Handle duplicate booking
    }
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

// Update Guide
const updateGuide = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  if (req.body.name) updateData.name = req.body.name;
  if (req.body.activities) updateData.activities = req.body.activities;
  if (req.body.locations) updateData.locations = req.body.locations;
  if (req.body.timeline) updateData.timeline = req.body.timeline;
  if (req.body.durationActivity) updateData.durationActivity = req.body.durationActivity;
  if (req.body.tourLanguage) updateData.tourLanguage = req.body.tourLanguage;
  if (req.body.TourPrice) updateData.TourPrice = req.body.TourPrice;
  if (req.body.availableDates) updateData.availableDates = req.body.availableDates;
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
      return res
        .status(400)
        .json({ message: "Itinerary cannot be deactivated because it has no bookings." });
    }

    // Toggle the activation status
    itinerary.isActive = !itinerary.isActive;
    await itinerary.save();

    if (itinerary.isActive) {
      return res.status(200).json({ message: "Itinerary activated", itinerary });
    } else {
      return res.status(200).json({ message: "Itinerary deactivated", itinerary });
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

    res.status(200).json({ message: "Booking canceled successfully", bookings: schema.bookings });
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
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    // Add the review to the itinerary
    itinerary.reviews.push({ userId, rating, comment });
    // Calculate the new average rating for the itinerary
    const totalRatings = itinerary.reviews.reduce((sum, review) => sum + review.rating, 0);
    itinerary.rating = totalRatings / itinerary.reviews.length;
    // Save the updated itinerary
    await itinerary.save();
    return res.status(200).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const getBookedItineraries = async (req, res) => {
  try {
    const { touristId } = req.query;
    // Validate touristId
    if (!touristId || !mongoose.isValidObjectId(touristId.trim())) {
      return res.status(400).json({ message: "Invalid or missing Tourist ID." });
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

    res.status(200).json(updatedSchema);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  createGuide,
  readGuide,
  readGuideID,
  updateGuide,
  deleteGuide,
  bookTour,
  flagItinerary,
  toggleActivation,
  cancelBooking,
  submitReview,
  getBookedItineraries,
  getIteneraries,
};
