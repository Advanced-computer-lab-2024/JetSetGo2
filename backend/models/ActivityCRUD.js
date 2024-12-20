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
    reviews: [
      { 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
      }
    ],
    bookedUsers: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },       rating: {
      type: Number,
      required: true,
    },
    flagged: {
      type: Boolean,
      default: false,
    }, // Add flagged attribute with default value

    notificationRequests: {
      type: [mongoose.Schema.Types.ObjectId], // Stores tourist IDs
      ref: "Tourist"
    },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Increment booking and ensure no double-booking
activitySchema.methods.incrementBookings = async function (userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check if the user has already booked
  const alreadyBooked = this.bookedUsers.some((bookedUserId) =>
    bookedUserId.equals(userObjectId)
  );

  if (alreadyBooked) {
    throw new Error("User has already booked this activity.");
  }

  // Increment bookings and push userId to bookedUsers
  this.bookings += 1;
  this.bookedUsers.push(userObjectId);

  await this.save(); // Save the updated activity
};
activitySchema.methods.cancelBooking = async function (userId) {
  // Check if the user has booked this itinerary
  if (!this.bookedUsers.some(bookedUserId => bookedUserId.equals(userId))) {
    throw new Error("User has not booked this activity.");
  }

  // Parse the activity date
  const activityDate = new Date(this.date);
  if (isNaN(activityDate)) {
    throw new Error("Activity date is invalid.");
  }

  // Calculate the time difference in hours
  const hoursDifference = (activityDate - Date.now()) / (1000 * 60 * 60);
  if (hoursDifference < 48) {
    throw new Error("Cancellations are allowed only 48 hours before the activity date.");
  }

  // Remove the booking and decrement the count
  this.bookedUsers = this.bookedUsers.filter(
    bookedUserId => !bookedUserId.equals(userId)
  );
  this.bookings -= 1;

  await this.save();
};


const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
