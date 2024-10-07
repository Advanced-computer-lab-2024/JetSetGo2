const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TouristSchema = new Schema(
  {
    Email: {
      type: String,
      required: true,
    },
    UserName: {
      type: String,
      required: true,
      immutable: true,
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
      required: false,
      immutable: true,
    },
  },
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", TouristSchema);
module.exports = Tourist;
