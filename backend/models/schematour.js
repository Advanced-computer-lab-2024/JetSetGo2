const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    activities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Activity", required: true },
    ],
    locations: [{ type: String, required: true }],
    timeline: [{ type: String, required: true }],
    durationActivity: [{ type: Number, required: true }],
    tourLanguage: [{ type: String, required: true }],
    TourPrice: [{ type: Number, required: true }],
    availableDates: [{ type: Date, required: true }],
    accessibility: [{ type: String, required: true }],
    pickUpLoc: [{ type: String, required: true }],
    DropOffLoc: [{ type: String, required: true }],
    bookings: { type: Number, default: 0 }, // Tracks the number of bookings
    bookedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    tourGuide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    Tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreferenceTag",
      required: true,
    },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Add a method to increment bookings, checking if the user already booked
schema.methods.incrementBookings = async function (userId) {
  if (this.bookedUsers.includes(userId)) {
    throw new Error("User has already booked this tour.");
  }
  this.bookings += 1;
  this.bookedUsers.push(userId); // Add user to the bookedUsers array
  await this.save();
};

module.exports = mongoose.model("SchemaT", schema);
