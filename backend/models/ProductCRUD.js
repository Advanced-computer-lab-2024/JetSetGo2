const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    pictures: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId, // ID of the seller (Admin or Seller)
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
      required: true,
      default: 0,
    },
    // Ratings array where each rating is a number and default is an empty array
    ratings: {
      type: [Number],
      default: [], // Default to an empty array if no ratings
      required: false, // Not required
    },
    // Reviews array where each review is a string and default is an empty array
    reviewsText: {
      type: [String],
      default: [], // Default to an empty array if no reviews
      required: false, // Not required
    },
    avgRating: {
      type: Number,
      default: 0,
      required: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
