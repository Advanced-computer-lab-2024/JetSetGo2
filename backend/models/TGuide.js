const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
});

const TGuidechema = new Schema(
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
    IDDocument: {
      type: String,
      required: true,
    },
    Certificates: {
      type: String,
      required: true,
    },
    Age: {
      type: Number,
      required: false,
    },
    LanguagesSpoken: {
      type: String,
      required: false,
    },
    MobileNumber: {
      type: Number,
      required: false,
    },
    Notifications: {
      type: [String],
      required: false,
    },
    YearsOfExperience: {
      type: Number,
      required: false,
    },
    PreviousWork: {
      type: String,
      required: false,
    },
    Photo: {
      type: String,
      required: false,
    },
    Profile_Completed: {
      type: Boolean,
      required: false,
    },
    reviews: [reviewSchema], // Add reviews for the tour guide
    Admin_Acceptance: { type: Boolean, default: null },
    sales: { // New 'sales' attribute
      type: Number,
      default: 0, // Default value for sales
      required: false,
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", TGuidechema);
module.exports = Tour;
