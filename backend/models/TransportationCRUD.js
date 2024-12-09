const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transportationSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    seatsAvailable: {
      type: Number,
      required: true,
    },
    MaxseatsAvailable: {
      type: Number,
      required: false,
    },
    driverName: {
      type: String,
      required: true,
    },
    isBookingOpen: {
      type: Boolean,
      required: true,
    },
    advertiser: {
        type: Schema.Types.ObjectId, // Using ObjectId to reference the Category model
        ref: "adver", // Reference to the Category model
        required: true,
    },
  },
  { timestamps: true }
);

const Transportation = mongoose.model("Transportation", transportationSchema);
module.exports = Transportation;
