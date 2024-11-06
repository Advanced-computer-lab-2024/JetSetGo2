const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String }
});

const TGuidechema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Age: {
    type: Number,
    required: true,
  },
  LanguagesSpoken: {
    type: String,
    required: true,
  },
  MobileNumber: {
    type: Number,
    required: true,
  },
  YearsOfExperience: {
    type: Number,
    required: true
  },
  PreviousWork: {
    type: String,
    required: false,
  },
  Email: {
    type: String,
    required: false,
  },
  reviews: [reviewSchema], // Add reviews for the tour guide
}, { timestamps: true });

// Method to submit a review for the tour guide
TGuidechema.methods.submitTourGuideReview = async function (userId, rating, comment) {
  this.reviews.push({ userId, rating, comment });
  // Optionally, calculate the average rating for the tour guide here
  await this.save();
};

const Tour = mongoose.model('Tour', TGuidechema);
module.exports = Tour;
