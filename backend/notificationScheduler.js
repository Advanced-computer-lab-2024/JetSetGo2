const schedule = require("node-schedule");
const moment = require("moment-timezone");
const SchemaT = require("./models/schematour"); // Itinerary model
const Notification = require("./models/Notification"); // Notification model
const User = require("./models/Tourist"); // User model
const itenaryMail = require("./utils/tabbakh3.js")

const scheduleItineraryNotifications = async () => {
  try {
    const itineraries = await SchemaT.find({ isActive: true }); // Only active itineraries

    itineraries.forEach((itinerary) => {
      const cairoTimezone = "Africa/Cairo";

      // Iterate over all available dates for the itinerary
      itinerary.availableDates.forEach((date) => {
        const itineraryDate = moment(date);
        const notificationTime = moment
          .tz(itineraryDate, cairoTimezone)
          .subtract(1, "days")
          .set({
            hour: 15,
            minute: 4,
            second: 0,
          });

        // Schedule only for future dates
        if (notificationTime.isSameOrAfter(moment())) {
          schedule.scheduleJob(notificationTime.toDate(), async () => {
            try {
              for (const userId of itinerary.bookedUsers) {
                const user = await User.findById(userId);
                if (user) {
                  const notificationMessage = `Reminder: Your itinerary "${
                    itinerary.name
                  }" starts on ${itineraryDate.format("YYYY-MM-DD")}.`;

                  // Save the notification in the database
                  await Notification.create({
                    receiverId: userId,
                    message: notificationMessage,
                  });

                  await sendNotificationEmails(user.Email, user.UserName  ,itinerary.name , itineraryDate);

                  console.log(
                    `Notification sent to user ${user.Email} for itinerary "${itinerary.name}".`
                  );
                }
              }
            } catch (err) {
              console.error(
                `Error sending notification for itinerary "${itinerary.name}":`,
                err
              );
            }
          });
        }
         else {
            console.log("zby mnga ");
         }
      });
    });
  } catch (err) {
    console.error("Error scheduling itinerary notifications:", err);
  }
};

module.exports = scheduleItineraryNotifications;