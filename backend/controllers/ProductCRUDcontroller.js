const express = require('express');
const router = express.Router();
const Product = require('../models/ProductCRUD'); // Adjust the path if needed
const Seller = require('../models/Seller');

// Create a new product
const createProduct = async (req, res) => {
  try {
    // Check if the provided seller ID is valid
    const sellerExists = await Seller.findById(req.body.seller);
    if (!sellerExists) {
      return res.status(400).json({ error: "Invalid seller ID" });
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products and populate seller information
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller','Name'); // Populate seller info
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  // Only add fields to updateData if they exist in the request body
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.pictures) updateData.pictures = req.body.pictures;
  if (req.body.price) updateData.price = req.body.price;
  if (req.body.seller) {
    // Check if the provided seller ID is valid before updating
    const sellerExists = await Seller.findById(req.body.seller);
    if (!sellerExists) {
      return res.status(400).json({ error: "Invalid seller ID" });
    }
    updateData.seller = req.body.seller;
  }
  if (req.body.rating) updateData.rating = req.body.rating;
  if (req.body.reviews) updateData.reviews = req.body.reviews;
  if (req.body.availableQuantity) updateData.availableQuantity = req.body.availableQuantity;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
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
const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});  // This will delete all products in the Product collection
    res.status(200).json({ message: "All products have been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Archive a product
const archiveProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product archived successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Unarchive a product
const unarchiveProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { isArchived: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product unarchived successfully", product });
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
  deleteAllProducts,
  archiveProduct,
  unarchiveProduct
};
