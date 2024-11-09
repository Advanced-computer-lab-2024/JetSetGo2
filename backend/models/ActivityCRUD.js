const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: {
      type: Schema.Types.ObjectId,
      ref: "PreferenceTag",
      required: true,
    },
    specialDiscount: {
      type: Number,
      required: true,
    },
    isBookingOpen: {
      type: Boolean,
      required: true,
    },
    advertiser: {
      type: Schema.Types.ObjectId,
      ref: "adver",
      required: true,
    },
    bookings: {
      type: Number,
      default: 0,
    },
    bookedUsers: { type: [Schema.Types.ObjectId], ref: 'User', default: [] }, rating: {
      type: Number,
      required: true,
    },
    flagged: { type: Boolean, default: false }, // Add flagged attribute with default value
  },
  { timestamps: true }
);

// Increment booking and ensure no double-booking
activitySchema.methods.incrementBookings = async function (userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check if the user has already booked
  const alreadyBooked = this.bookedUsers.some(bookedUserId =>
    bookedUserId.equals(userObjectId)
  );

  if (alreadyBooked) {
    throw new Error("User has already booked this activity.");
  }

  // Increment bookings and push userId to bookedUsers
  this.bookings += 1;
  this.bookedUsers.push(userObjectId);

  await this.save();  // Save the updated activity
};
const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
