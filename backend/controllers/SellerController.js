const express = require("express");
const SellerModel = require("../models/Seller.js");

// Create a new seller
const createSeller = async (req, res) => {
  const { Name, PickUp_Location, Type_Of_Products, Previous_Work, Age, Email } =
    req.body;
  const logo = req.file ? req.file.filename.split("/").pop() : null; // Get the logo path if uploaded

  try {
    // Validate required fields
    if (
      !Name ||
      !PickUp_Location ||
      !Type_Of_Products ||
      !Previous_Work ||
      !Age ||
      !Email
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new seller with the data provided in the request body
    const seller = await SellerModel.create({
      Name,
      PickUp_Location,
      Type_Of_Products,
      Previous_Work,
      Age,
      Email,
      logo, // Include the logo path
    });

    // Respond with the created seller
    res.status(200).json(seller);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read a seller by the MongoDB `_id`
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
  const { Name, PickUp_Location, Type_Of_Products, Previous_Work, Age, Email } =
    req.body;
  const logo = req.file ? req.file.filename.split("/").pop() : null; // Get just the filename if uploaded

  try {
    // Construct an object containing only the fields that are provided
    const updateFields = {};
    if (Name) updateFields.Name = Name;
    if (PickUp_Location) updateFields.PickUp_Location = PickUp_Location;
    if (Type_Of_Products) updateFields.Type_Of_Products = Type_Of_Products;
    if (Previous_Work) updateFields.Previous_Work = Previous_Work;
    if (Age) updateFields.Age = Age;
    if (Email) updateFields.Email = Email;
    if (logo) updateFields.logo = logo; // Update logo if provided, saving only the filename

    // Update the seller with only the provided fields, using _id to search
    const seller = await SellerModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Return the updated seller information
    res.status(200).json(seller);
    console.log("Saved logo filename:", logo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all sellers
const getSeller = async (req, res) => {
  try {
    const sellers = await SellerModel.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAllSellers = async (req, res) => {
  try {
    await SellerModel.deleteMany({}); // This will delete all sellers in the Seller collection
    res.status(200).json({ message: "All sellers have been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a seller
const deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the seller by ID and delete it
    const deletedSeller = await SellerModel.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Respond with a success message
    res.status(200).json({
      message: "Seller deleted successfully",
      seller: deletedSeller,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting seller",
      error,
    });
  }
};

module.exports = {
  createSeller,
  readSeller,
  updateSeller,
  getSeller,
  deleteSeller,
  deleteAllSellers,
};
