const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  }, // e.g., SAVE20
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  }, // "percentage" or "fixed"
  discountValue: {
    type: Number,
    required: true,
  }, // e.g., 20 for 20% or $50
  startDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);
