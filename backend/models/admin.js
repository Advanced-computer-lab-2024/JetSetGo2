const mongoose = require("mongoose");

const AdminModel = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    //  unique: true,
    lowercase: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Admin_Acceptance: {
    type: Boolean,
    required: false,
  },
});

// Correctly export the model
const adminSchema = mongoose.model("AdminShema", AdminModel);
module.exports = adminSchema;
