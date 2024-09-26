const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TGuidechema = new Schema({
    Name: {
        type: String,
        required: true,
      },
      Age:{
        type: Number,
        required: true,
      },
      LanguagesSpoken:{
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
      }

  }, { timestamps: true });
  const Tour = mongoose.model('Tour', TGuidechema);
module.exports = Tour;