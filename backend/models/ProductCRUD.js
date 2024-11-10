const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    description: {
        type: String,
        required: true,
      },
      pictures: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
      },
      seller: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: false,
      },
      reviews: {
        type: String,
        required: false,
      },
      availableQuantity: {
        type: Number,
        required: true,
      },
      seller: {
        type: Schema.Types.ObjectId,  // Using ObjectId to reference the Category model
        ref: 'Seller',  // Reference to the Category model
        required: true,
      },
      sales: {
        type: Number,  // Add this field to track the number of sales
        required: true,
        default: 0,    // Default to 0 if no sales yet
      },
      isArchived: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;