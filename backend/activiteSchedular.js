const schedule = require("node-schedule");
const moment = require("moment-timezone");
const Activity = require("./models/ActivityCRUD"); // Activity model
const Notification = require("./models/Notification"); // Notification model
const User = require("./models/Tourist"); // User model
const activityMail = require("./utils/tabbakh4"); // Utility to send email

const scheduleActivityNotifications = async () => {
  try {
    const activities = await Activity.find({ isActive: true }); // Only active activities

    activities.forEach((activity) => {
      const cairoTimezone = "Africa/Cairo";

      // Parse activity date and time
      const activityDateTime = moment.tz(
        `${activity.date} ${activity.time}`,
        "YYYY-MM-DD HH:mm",
        cairoTimezone
      );

      const notificationTime = activityDateTime.clone().subtract(1, "days").set({
        hour: 15,
        minute: 0,
        second: 0,
      });

      // Schedule only for future dates
      if (notificationTime.isSameOrAfter(moment())) {
        schedule.scheduleJob(notificationTime.toDate(), async () => {
          try {
            for (const userId of activity.bookedUsers) {
              const user = await User.findById(userId);
              if (user) {
                const notificationMessage = `Reminder: Your activity at ${
                  activity.location
                } is scheduled for ${activityDateTime.format("YYYY-MM-DD HH:mm")}.`;

                // Save the notification in the database
                await Notification.create({
                  receiverId: userId,
                  message: notificationMessage,
                });

                // Send email notification
                await activityMail(user.Email, user.UserName, activity.location, activityDateTime);

                console.log(
                  `Notification sent to user ${user.Email} for activity at "${activity.location}".`
                );
              }
            }
          } catch (err) {
            console.error(
              `Error sending notification for activity at "${activity.location}":`,
              err
            );
          }
        });
      } else {
        console.log("Skipping past activity for notification scheduling.");
      }
    });
  } catch (err) {
    console.error("Error scheduling activity notifications:", err);
  }
};

module.exports = scheduleActivityNotifications;
