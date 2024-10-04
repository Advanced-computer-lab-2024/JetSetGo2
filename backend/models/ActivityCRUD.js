const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true
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
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  specialDiscount: {
    type: Number,
    required: true,
  },
  isBookingOpen: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;