const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historicalPlaceSchema = new Schema({
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

const Historicalplace = mongoose.model('HistoricalPlace', historicalPlaceSchema);
module.exports = Historicalplace;