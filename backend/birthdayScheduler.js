// birthdayScheduler.js
const schedule = require("node-schedule");
const moment = require("moment-timezone");
const User = require("./models/Tourist");
const PromoCode = require("./models/PromoCode");
const generatePromoCode = require("./utils/generatePromoCode");
const sendEmail = require("./utils/sendBirthPromoEmail");

const scheduleBirthdayEmails = async () => {
  try {
    const users = await User.find();

    users.forEach((user) => {
      const cairoTimezone = "Africa/Cairo";
      const currentYear = new Date().getFullYear();

      // Get the user's birthday this year
      const userBirthday = moment(user.DateOfBirth).year(currentYear);
      const birthdayAtSixPM = moment.tz(userBirthday, cairoTimezone).set({
        hour: 18,
        minute: 43,
        second: 0,
      });

      // Schedule only for future birthdays
      if (birthdayAtSixPM.isSameOrAfter(moment())) {
        schedule.scheduleJob(birthdayAtSixPM.toDate(), async () => {
          try {
            const promoCode = generatePromoCode();

            // Save promo code to the database
            const newPromoCode = new PromoCode({
              code: promoCode,
              discountType: "percentage",
              discountValue: 20, // Example: 20% discount
              startDate: new Date(),
              expiryDate: moment().add(1, "month").toDate(), // Valid for 1 month
            });
            await newPromoCode.save();

            // Send promo code via email
            await sendEmail(user.Email, promoCode);
            console.log(`Promo code sent to ${user.Email}`);
          } catch (err) {
            console.error(`Error sending promo code to ${user.Email}:`, err);
          }
        });
      }
    });
  } catch (err) {
    console.error("Error scheduling birthday emails:", err);
  }
};

module.exports = scheduleBirthdayEmails;
