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
    tourGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    Tags: { type: mongoose.Schema.Types.ObjectId, ref: 'PreferenceTag', required: true },

}, {
    timestamps: true
});

module.exports = mongoose.model("SchemaT", schema);
