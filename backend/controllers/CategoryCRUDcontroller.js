const express = require('express');
const router = express.Router();
const Category = require('../models/CategoryCRUD');
const Activity = require('../models/ActivityCRUD');

// CRUD operations for Category

// Create Category
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Categories
const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  const { id } = req.params; // Extract id from the request parameters
  const updateData = {}; // Initialize an empty object for updates

  // Only add fields to updateData if they exist in the request body
  if (req.body.name) updateData.name = req.body.name;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensure validators run on updates
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.status(200).json(updatedCategory); // Send updated category as response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete Category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // First, delete all activities associated with this category
    await Activity.deleteMany({ category: id });

    // Then, delete the category itself
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category and associated activities deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
};
