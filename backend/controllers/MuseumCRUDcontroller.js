const express = require('express');
const router = express.Router();
const Museum = require('../models/MuseumCRUD'); // Assuming you have Museum model like HistoricalPlaceCRUD
const TourismGovernerTag = require('../models/tourismGovernerTags'); // Import the tourismGovernerTag model

// CRUD operations

// Create a Museum with tourismGovernerTags reference
const createMuseum = async (req, res) => {
  try {
    const { description, pictures, location, openingHours, foreignerTicketPrice, nativeTicketPrice, studentTicketPrice, tourismGovernerTags } = req.body;

    // Find the tourismGovernerTags (this ensures you're referencing valid tags)
    const tag = await TourismGovernerTag.findById(tourismGovernerTags);
    if (!tag) {
      return res.status(400).json({ error: 'Invalid tourism governer tag' });
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
      tourismGovernerTags: tag._id // Reference the tourismGovernerTags by _id
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
    const museums = await Museum.find()
      .populate('tourismGovernerTags', 'name type');  // Populate specific fields ('name' and 'type')
    res.status(200).json(museums);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch a single Museum by ID with populated tourismGovernerTags
const getMuseumById = async (req, res) => {
  const { id } = req.params; // Extract the museum ID from request parameters
  try {
    const museum = await Museum.findById(id).populate('tourismGovernerTags', 'name type');
    if (!museum) {
      return res.status(404).json({ error: 'Museum not found' });
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
    res.status(200).json({ message: 'All Museums have been deleted' });
  } catch (error) {
    console.error("Error deleting Museums:", error);
    res.status(500).json({ error: error.message });
  }
};
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
  getMuseumById
};