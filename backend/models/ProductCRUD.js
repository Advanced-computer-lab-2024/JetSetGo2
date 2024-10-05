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
        required: true,
      },
      reviews: {
        type: String,
        required: true,
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
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;