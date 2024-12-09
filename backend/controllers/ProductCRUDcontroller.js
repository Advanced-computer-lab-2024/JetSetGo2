const express = require("express");
const router = express.Router();
const Product = require("../models/ProductCRUD"); // Adjust the path if needed
const Seller = require("../models/Seller");
const Admin = require("../models/admin");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { sellerId, description, pictures, price, availableQuantity } =
      req.body;

    // Validate required fields
    if (
      !sellerId ||
      !description ||
      !pictures ||
      !price ||
      !availableQuantity
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if seller ID exists in Seller or Admin collections
    const sellerExists =
      (await Seller.findById(sellerId)) || (await Admin.findById(sellerId));
    if (!sellerExists) {
      return res.status(400).json({ error: "Invalid seller ID." });
    }

    // Check if the pictures field is a valid base64 string
    if (!req.body.pictures || !req.body.pictures.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    // Optionally, you can remove the prefix before saving (if you only want the base64 part)
    const base64Image = req.body.pictures.replace(
      /^data:image\/[a-zA-Z]+;base64,/,
      ""
    );

    const productData = {
      ...req.body,
      pictures: base64Image, // Save only the base64 part
    };

    const product = await Product.create(productData);

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products and populate seller information
const getProducts = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find();

    // Populate seller information dynamically
    const populatedProducts = await Promise.all(
      products.map(async (product) => {
        // Check if seller exists in Seller or Admin collection
        const seller = await Seller.findById(product.sellerId);
        const admin = await Admin.findById(product.sellerId);

        // Attach seller name and role to the product
        return {
          ...product.toObject(), // Convert Mongoose document to plain object
          sellerDetails: seller
            ? { name: seller.Name, role: "Seller" }
            : admin
            ? { name: admin.Username, role: "Admin" }
            : null, // If no match found
        };
      })
    );

    res.status(200).json(populatedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  // Only add fields to updateData if they exist in the request body
  if (req.body.description) updateData.description = req.body.description;

  if (req.body.pictures) {
    // Check if the pictures field is a valid base64 string
    if (!req.body.pictures.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    // Remove the prefix before saving (if you only want the base64 part)
    updateData.pictures = req.body.pictures.replace(
      /^data:image\/[a-zA-Z]+;base64,/,
      ""
    );
  }

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
  if (req.body.availableQuantity)
    updateData.availableQuantity = req.body.availableQuantity;

  if (req.body.availableQuantity > 0) {
    updateData.outOfStockNotified = false;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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
    await Product.deleteMany({}); // This will delete all products in the Product collection
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

    res
      .status(200)
      .json({ message: "Product unarchived successfully", product });
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
  unarchiveProduct,
};
