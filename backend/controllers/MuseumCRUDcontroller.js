const express = require('express');
const router = express.Router();
const Museum = require('../models/MuseumCRUD');

// CRUD operations
const createMuseum = async (req, res) => {
  try {
    const museum = await Museum.create(req.body);
    res.status(201).json(museum);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMuseum = async (req, res) => {
  try {
    const museums = await Museum.find();
    res.status(200).json(museums);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMuseum = async (req, res) => {
  const { id } = req.params; // Extract id from the request parameters
  const updateData = {}; // Initialize an empty object for updates

  // Only add fields to updateData if they exist in the request body
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.pictures) updateData.pictures = req.body.pictures;
  if (req.body.location) updateData.location = req.body.location;
  if (req.body.openingHours) updateData.openingHours = req.body.openingHours;
  if (req.body.ticketPrice) updateData.ticketPrice = req.body.ticketPrice;

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

 

const deleteMuseum = async (req, res) => {
  const { id } = req.body;
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



module.exports = {createMuseum,getMuseum,updateMuseum,deleteMuseum};
