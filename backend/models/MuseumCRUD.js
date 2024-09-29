const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const museumSchema = new Schema({
    description: {
        type: String,
        required: true,
      },
      pictures: {
        type: String,
        required: true
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
      }
}, { timestamps: true });

const Museum = mongoose.model('Museum', museumSchema);
module.exports = Museum;