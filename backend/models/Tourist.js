const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TouristSchema = new Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    Password: {
      type: String,
      required: true,
    },
    MobileNumber: {
      type: Number,
      required: true,
    },
    Nationality: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: Date,
      required: true,
      immutable: true,
    },
    Job: {
      type: String,
      required: true,
    },
    Wallet: {
      type: Number,
      default: 0,
    },
    Admin_Acceptance: {
      type: Boolean,
      required: false,
    },
    bookedTransportations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transportation",
      },
    ],
    purchasedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    bookedFlights: [Object],
    Total_Loyalty_Points: {
      type: Number,
      default: 0,
    },
    Loyalty_Points: {
      type: Number,
      default: 0,
    },
    Loyalty_Level: {
      type: Number,
      default: 1,
    },
    bookedHotels: [Object],

    // New attributes for bookmarking
    bookmarkedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    bookmarkedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SchemaT",
      },
    ],
    bookmarkedHistoricalPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HistoricalPlace",
      },
    ],
    bookmarkedMuseums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Museum",
      },
    ],
  },
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", TouristSchema);
module.exports = Tourist;
