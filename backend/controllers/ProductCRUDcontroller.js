const express = require('express');
const router = express.Router();
const Product = require('../models/ProductCRUD'); // Adjust the path if needed

// CRUD operations

// Create a new product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  const { id } = req.params; // Extract id from the request parameters
  const updateData = {}; // Initialize an empty object for updates

  // Only add fields to updateData if they exist in the request body
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.pictures) updateData.pictures = req.body.pictures;
  if (req.body.price) updateData.price = req.body.price;
  if (req.body.seller) updateData.seller = req.body.seller;
  if (req.body.rating) updateData.rating = req.body.rating;
  if (req.body.reviews) updateData.reviews = req.body.reviews;
  if (req.body.availableQuantity) updateData.availableQuantity = req.body.availableQuantity;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensure validators run on updates
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct); // Send updated product as response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Exporting the controller functions
module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
