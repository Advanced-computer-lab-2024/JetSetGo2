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

const readGuideID = async (req, res) => {
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
  const { id } = req.params; // Extract id from the request body
  const updateData = {}; // Initialize an empty object for updates

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
  if (req.body.accesibility) updateData.accesibility = req.body.accesibility;
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
  flagItinerary
};
