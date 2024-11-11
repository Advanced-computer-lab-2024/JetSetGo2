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
    bookings: {
      type: Number,
      default: 0,
    },
    reviews: [
      { 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },

      }
    ],
    bookedUsers: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },   
    rating: {
      type: Number,
    },
    flagged: { type: Boolean, default: false }, // Add flagged attribute with default value
  },
  { timestamps: true }
);

// Increment booking and ensure no double-booking
historicalPlaceSchema.methods.incrementBookings = async function (userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check if the user has already booked
  const alreadyBooked = this.bookedUsers.some(bookedUserId =>
    bookedUserId.equals(userObjectId)
  );

  if (alreadyBooked) {
    throw new Error("User has already booked this hp.");
  }

  // Increment bookings and push userId to bookedUsers
  this.bookings += 1;
  this.bookedUsers.push(userObjectId);

  await this.save();  // Save the updated activity
};
historicalPlaceSchema.methods.cancelBooking = async function (userId) {
  // Check if the user has booked this itinerary
  if (!this.bookedUsers.some(bookedUserId => bookedUserId.equals(userId))) {
    throw new Error("User has not booked this activity.");
  }

  // Parse the activity date

  // Calculate the time difference in hours


  // Remove the booking and decrement the count
  this.bookedUsers = this.bookedUsers.filter(
    bookedUserId => !bookedUserId.equals(userId)
  );
  this.bookings -= 1;

  await this.save();
};
const Historicalplace = mongoose.model(
  "HistoricalPlace",
  historicalPlaceSchema
);
module.exports = Historicalplace;
