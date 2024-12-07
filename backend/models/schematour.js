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
    notificationRequests: {
      type: [mongoose.Schema.Types.ObjectId], // Stores tourist IDs
      ref: "Tourist",
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
    flagged: { type: Boolean, default: false }, // Add flagged attribute with default value
    reviews: [
      { 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String }
      }
    ],
    isActive: { type: Boolean, default: true },

    isActive1: { type: Boolean, default: false },
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

// Method to submit a review for the itinerary
schema.methods.submitItineraryReview = async function (userId, rating, comment) {
  this.itineraryReviews.push({ userId, rating, comment });
  // Recalculate the average rating based on all reviews
  this.rating = this.itineraryReviews.reduce((acc, review) => acc + review.rating, 0) / this.itineraryReviews.length;
  await this.save();
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

// Method to cancel a booking
schema.methods.cancelBooking = async function (userId) {
  if (!this.bookedUsers.includes(userId)) {
    throw new Error("User has not booked this tour.");
  }

  const nearestAvailableDate = this.availableDates.find(date => date > new Date());
  if (!nearestAvailableDate) {
    throw new Error("No future dates available for this tour.");
  }

  const hoursDifference = (nearestAvailableDate - Date.now()) / (1000 * 60 * 60);
  if (hoursDifference < 48) {
    throw new Error("Cancellations are allowed only 48 hours before the tour date.");
  }

  this.bookedUsers = this.bookedUsers.filter(user => user.toString() !== userId.toString());
  this.bookings -= 1;

  await this.save();
};

module.exports = mongoose.model("SchemaT", schema);
