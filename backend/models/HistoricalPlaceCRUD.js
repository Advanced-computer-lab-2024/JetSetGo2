const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalPlaceSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    pictures: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    openingHours: {
      type: String,
      required: true,
    },
    foreignerTicketPrice: {
      type: Number,
      required: true,
    },
    nativeTicketPrice: {
      type: Number,
      required: true,
    },
    studentTicketPrice: {
      type: Number,
      required: true,
    },
    tourismGovernerTags: {
      type: Schema.Types.ObjectId, // Using ObjectId to reference the Category model
      ref: "tourismGovernerTag", // Reference to the Category model
      required: true,
    },
    flagged: { type: Boolean, default: false }, // Add flagged attribute with default value
  },
  { timestamps: true }
);

const Historicalplace = mongoose.model(
  "HistoricalPlace",
  historicalPlaceSchema
);
module.exports = Historicalplace;
