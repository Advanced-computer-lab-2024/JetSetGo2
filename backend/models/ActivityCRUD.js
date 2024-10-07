const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,  // Using ObjectId to reference the Category model
    ref: 'Category',  // Reference to the Category model
    required: true,
  },
  tags: {
    type: Schema.Types.ObjectId,
    ref:"PreferenceTag",
    required: true,
  },
  specialDiscount: {
    type: Number,
    required: true,
  },
  isBookingOpen: {
    type: Boolean,
    required: true,
  },
  advertiser: {
    type: Schema.Types.ObjectId,  // Using ObjectId to reference the Category model
    ref: 'adver',  // Reference to the Category model
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
