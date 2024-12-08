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
    foreignerTicketPrice: {
      type: Number,
      required: true,
    },
    nativeTicketPrice: {
      type: Number,
      required: true,
    },
    Notifications: {
      type: [String],
      required: false,
    },
    studentTicketPrice: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
    },
    bookedUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
      },
    ],
    bookings: {
      type: Number,
      default: 0,
    },
    tourismGovernerTags: {
      type: Schema.Types.ObjectId, // Using ObjectId to reference the Category model
      ref: "tourismGovernerTag", // Reference to the Category model
      required: true,
    },
    flagged: { type: Boolean, default: false }, // Add flagged attribute with default value
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);
museumSchema.methods.incrementBookings = async function (userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check if the user has already booked
  const alreadyBooked = this.bookedUsers.some((bookedUserId) =>
    bookedUserId.equals(userObjectId)
  );

  if (alreadyBooked) {
    throw new Error("User has already booked this hp.");
  }

  // Increment bookings and push userId to bookedUsers
  this.bookings += 1;
  this.bookedUsers.push(userObjectId);

  await this.save(); // Save the updated activity
};
museumSchema.methods.cancelBooking = async function (userId) {
  // Check if the user has booked this itinerary
  if (!this.bookedUsers.some((bookedUserId) => bookedUserId.equals(userId))) {
    throw new Error("User has not booked this activity.");
  }

  // Parse the activity date

  // Calculate the time difference in hours

  // Remove the booking and decrement the count
  this.bookedUsers = this.bookedUsers.filter(
    (bookedUserId) => !bookedUserId.equals(userId)
  );
  this.bookings -= 1;

  await this.save();
};

const Museum = mongoose.model("Museum", museumSchema);
module.exports = Museum;
