const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }, // Reference to the owner
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  }, // Read status
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
