const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'food',
      'stand up comedy',
      'concert',
      'party',
      'bazaars',
      'exhibitions',
      'sports matches',
      'events',
      'parks',
      'Other'
    ],
  }
  
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
