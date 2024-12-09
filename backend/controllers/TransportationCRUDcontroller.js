const { default: mongoose } = require("mongoose");
const Transportation = require("../models/TransportationCRUD");
const Advertiser = require("../models/AdverMODEL"); // Assuming this is the model for advertiser

// Create Transportation
const createTransportation = async (req, res) => {
  try {
    // Ensure the provided advertiser ID is valid
    const advertiser = await Advertiser.findById(req.body.advertiser);
    if (!advertiser) {
      return res.status(400).json({ error: "Invalid advertiser" });
    }

    const transportationData = {
      ...req.body,
      advertiser: req.body.advertiser, // Add advertiser to the transportation
      
  MaxSeatsAvailable: req.body.seatsAvailable, // Assign directly
    };

    // Check if the date has passed
    const transportationDate = new Date(req.body.date); // Convert date from string to Date object
    const currentDate = new Date();

    // If the transportation date has passed, set isBookingOpen to false
    if (transportationDate < currentDate || req.body.seatsAvailable <= 0) {
      transportationData.isBookingOpen = false;
    } else {
      transportationData.isBookingOpen = true;
    }

    // Create the transportation with the updated data
    const transportation = await Transportation.create(transportationData);

    res.status(201).json(transportation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get All Transportations with Advertiser Populated
const getAllTransportations = async (req, res) => {
  try {
    const transportations = await Transportation.find().populate("advertiser", "Name");
    console.log(transportations);

    res.status(200).json(transportations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Fetch Transportations by Criteria
const getTransportationsByCriteria = async (req, res) => {
  try {
    const { date, startLocation, endLocation, vehicleType } = req.query;

    const query = { isBookingOpen: true }; // Ensure booking is open
    if (date) query.date = date;
    if (startLocation) query.startLocation = startLocation;
    if (endLocation) query.endLocation = endLocation;
    if (vehicleType) query.vehicleType = vehicleType;

    const transportations = await Transportation.find(query).populate("advertiser", "Name");
    res.status(200).json(transportations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Transportation
const updateTransportation = async (req, res) => {
  const { id } = req.params; // Get the transportation ID from the request params
  const updateData = {};

  // Add fields to updateData if they exist in the request body
  if (req.body.date) updateData.date = req.body.date;
  if (req.body.time) updateData.time = req.body.time;
  if (req.body.startLocation) updateData.startLocation = req.body.startLocation;
  if (req.body.endLocation) updateData.endLocation = req.body.endLocation;
  if (req.body.price) updateData.price = req.body.price;
  if (req.body.vehicleType) updateData.vehicleType = req.body.vehicleType;
  if (req.body.seatsAvailable) updateData.seatsAvailable = req.body.seatsAvailable;
  if (req.body.driverName) updateData.driverName = req.body.driverName;
  if (req.body.isBookingOpen !== undefined)
    updateData.isBookingOpen = req.body.isBookingOpen;

  if (req.body.advertiser) {
    // Ensure the advertiser ID is valid
    const advertiser = await Advertiser.findById(req.body.advertiser);
    if (!advertiser) {
      return res.status(400).json({ error: "Invalid advertiser" });
    }
    updateData.advertiser = req.body.advertiser; // Set advertiser ID
  }

  try {
    const updatedTransportation = await Transportation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensure validators run on updates
    ).populate("advertiser", "Name"); // Populate advertiser field

    if (!updatedTransportation) {
      return res.status(404).json({ error: "Transportation not found" });
    }

    res.status(200).json(updatedTransportation); // Send updated transportation as response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Transportation
const deleteTransportation = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTransportation = await Transportation.findByIdAndDelete(id);
    if (!deletedTransportation) {
      return res.status(404).json({ error: "Transportation not found" });
    }
    res.status(200).json({ message: "Transportation deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete All Transportations
const deleteAllTransportations = async (req, res) => {
  try {
    await Transportation.deleteMany({});
    res.status(200).json({ message: "All transportations have been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Advertiser's Transportations
const readAdvertiserTransportations = async (req, res) => {
  try {
    const userId = req.query.userId;
    const transportations = await Transportation.find({
      advertiser: new mongoose.Types.ObjectId(userId),
    }).populate("advertiser");
    res.status(200).json(transportations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Upcoming Transportations
const getUpcomingTransportations = async (req, res) => {
  try {
    const now = new Date(); // Get the current date and time
    const upcomingTransportations = await Transportation.find({ date: { $gt: now } })
      .populate("advertiser") // Populate advertiser details if needed
      .sort({ date: 1 }); // Sort by date in ascending order

    if (upcomingTransportations.length === 0) {
      return res.status(404).json({ message: "No upcoming transportations found." });
    }

    res.json(upcomingTransportations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming transportations." });
  }
};

module.exports = {
  createTransportation,
  getAllTransportations,
  updateTransportation,
  deleteTransportation,
  deleteAllTransportations,
  readAdvertiserTransportations,
  getUpcomingTransportations,
  getTransportationsByCriteria,
};
