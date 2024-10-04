const express = require('express');
const router = express.Router();
const HistoricalPlace = require('../models/HistoricalPlaceCRUD');
const TourismGovernerTag = require('../models/tourismGovernerTags'); // Import the tourismGovernerTag model

// CRUD operations

// Create a Historical Place with tourismGovernerTags reference
const createHistoricalPlace = async (req, res) => {
  try {
    const { description, pictures, location, openingHours, ticketPrice, tourismGovernerTags } = req.body;

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
      ticketPrice,
      tourismGovernerTags: tag._id // Reference the tourismGovernerTags by _id
    });

    res.status(201).json(historicalPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch all Historical Places with populated tourismGovernerTags
const getHistoricalPlace = async (req, res) => {
  try {
    // Use .populate to fill the tourismGovernerTags field with actual data
    const historicalPlaces = await HistoricalPlace.find().populate('tourismGovernerTags','name');
    res.status(200).json(historicalPlaces);
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
  if (req.body.ticketPrice) updateData.ticketPrice = req.body.ticketPrice;

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
};
