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
    bookings: { type: Number, default: 0 },
    bookedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    tourGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    Tags: { type: mongoose.Schema.Types.ObjectId, ref: 'PreferenceTag', required: true },
    rating: { type: Number, required: true },
    flagged: { type: Boolean, default: false }, // Add flagged attribute with default value
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Method to activate or deactivate based on booking count
schema.methods.toggleActive = async function () {
  if (this.bookings < 1) {
    throw new Error("Cannot deactivate without any bookings.");
  }
  this.isActive = !this.isActive;
  return await this.save();
};

// Method to increment bookings and ensure the user hasn't already booked
schema.methods.incrementBookings = async function (userId) {
  if (this.bookedUsers.includes(userId)) {
    throw new Error("User has already booked this tour.");
  }
  this.bookings += 1;
  this.bookedUsers.push(userId);
  await this.save();
};

module.exports = mongoose.model("SchemaT", schema);
