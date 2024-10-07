const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const museumSchema = new Schema(
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
    ticketPrice: {
      type: Number,
      required: true,
    },
    tourismGovernerTags: {
      type: Schema.Types.ObjectId, // Using ObjectId to reference the Category model
      ref: "tourismGovernerTag", // Reference to the Category model
      required: true,
    },
  },
  { timestamps: true }
);

const Museum = mongoose.model("Museum", museumSchema);
module.exports = Museum;
