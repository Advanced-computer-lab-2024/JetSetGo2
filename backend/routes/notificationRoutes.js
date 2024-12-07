const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/NotificationController");

router.get("/:userId", getNotifications); // Fetch notifications for a user
router.patch("/read/:notificationId", markNotificationAsRead); // Mark a notification as read

module.exports = router;
