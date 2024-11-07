const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
    Admin_Acceptance: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);
const Tour = mongoose.model("Tour", TGuidechema);
module.exports = Tour;
