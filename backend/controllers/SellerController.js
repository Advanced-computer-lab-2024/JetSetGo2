const express = require('express');
const SellerModel = require('../models/Seller.js');

// Create a new seller
const createSeller = async (req, res) => {
    const { Name, Password, Email, Description } = req.body;

    try {
        // Create a new seller with the data provided in the request body
        const seller = await SellerModel.create({ Name, Password, Email, Description });
        
        // Respond with the created seller
        res.status(200).json(seller);
    } catch (error) {
        // If there's an error, return a 400 status and the error message
        res.status(400).json({ error: error.message });
    }
};

// Read a seller by the MongoDB `_id` (generated automatically when creating a seller)
const readSeller = async (req, res) => {
    const { id } = req.params; // Get the 'id' from the request parameters

    try {
        // Find the seller by their MongoDB `_id`
        const seller = await SellerModel.findById(id);

        // Check if seller exists
        if (!seller) {
            return res.status(404).json({ error: "Seller not found" });
        }

        // If seller is found, return the seller's information
        res.status(200).json(seller);
    } catch (error) {
        // Catch any errors and respond with a 400 status and error message
        res.status(400).json({ error: error.message });
    }
};

// Update a seller by the MongoDB `_id`
const updateSeller = async (req, res) => {
    const { id } = req.params; // Get the 'id' from the request parameters
    const { Name, Password, Email, Description } = req.body;

    try {
        // Construct an object containing only the fields that are provided
        const updateFields = {};
        if (Name) updateFields.Name = Name;
        if (Password) updateFields.Password = Password;
        if (Email) updateFields.Email = Email;
        if (Description) updateFields.Description = Description;

        // Update the seller with only the provided fields, using _id to search
        const seller = await SellerModel.findByIdAndUpdate(
            id,
            { $set: updateFields },  // Use $set to update only the provided fields
            { new: true }  // Return the updated document
        );

        if (!seller) {
            return res.status(404).json({ error: "Seller not found" });
        }

        // Return the updated seller information
        res.status(200).json(seller);
    } catch (error) {
        // Catch any errors and respond with a 400 status and error message
        res.status(400).json({ error: error.message });
    }
};

const getSeller = async (req, res) => {
    try {
      const seller = await SellerModel.find();
      res.status(200).json(seller);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

module.exports = {
    createSeller,
    readSeller,
    updateSeller,
    getSeller
};
