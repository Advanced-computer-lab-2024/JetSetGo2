const express = require('express');
const router = express.Router();
const HistoricalPlace = require('../models/HistoricalPlaceCRUD');

// CRUD operations
const createHistoricalPlace = async (req, res) => {
  try {
    const historicalPlace = await HistoricalPlace.create(req.body);
    res.status(201).json(historicalPlace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getHistoricalPlace = async (req, res) => {
  try {
    const historicalPlaces = await HistoricalPlace.find();
    res.status(200).json(historicalPlaces);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateHistoricalPlace = async (req, res) => {
    const { id } = req.body; // Extract id from the request body
    const updateData = {}; // Initialize an empty object for updates
 
    // Only add fields to updateData if they exist in the request body
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.pictures) updateData.pictures = req.body.pictures;
    if (req.body.location) updateData.location = req.body.location;
    if (req.body.openingHours) updateData.openingHours = req.body.openingHours;
    if (req.body.ticketPrice) updateData.ticketPrice = req.body.ticketPrice;
 
    try {
       const updatedHistoricalPlace = await HistoricalPlace.findByIdAndUpdate(id, updateData, { new: true });
       if (!updatedHistoricalPlace) {
          return res.status(404).json({ error: "Historical place not found" });
       }
       res.status(200).json(updatedHistoricalPlace);
    } catch (error) {
       res.status(400).json({ error: error.message });
    }
 };
 

const deleteHistoricalPlace = async (req, res) => {
  const { id } = req.body;
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

// Define routes
router.post("/add", createHistoricalPlace);
router.get("/get", getHistoricalPlace);
router.put("/update", updateHistoricalPlace);
router.delete("/delete", deleteHistoricalPlace);

module.exports = router;
