const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [true, 'Path `username` is required.']
   },
   password: {
      type: String,
      required: [true, 'Path `password` is required.']
   },
});

// Correctly export the model
const adminModel = mongoose.model('admin', adminSchema);
module.exports = adminModel; 
