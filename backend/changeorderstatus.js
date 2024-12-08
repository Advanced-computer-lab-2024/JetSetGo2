const schedule = require("node-schedule");
const moment = require("moment-timezone");
const touristModel = require("./models/Tourist");

const scheduleAllOrdersStatusUpdate = async () => {
  try {
    // Fetch all tourists with purchased products and populate product details
    const tourists = await touristModel
      .find({ "purchasedProducts.product": { $exists: true } })
      .populate("purchasedProducts.product");

    tourists.forEach(async (tourist) => {
      const updated = false;
      tourist.purchasedProducts.forEach((order) => {
        if (!order.product || !order.product._id) {
          console.error("Missing product data for an order. Skipping...");
          return;
        }

        // If the order doesn't have a status, initialize it as "Pending"
        if (!order.status) {
          order.status = "Pending";
          updated = true;
        }

        const oneMinuteFromNow = moment().add(1, "minute").toDate(); // Time to change to "Shipped"

        // console.log(
        //   `Order status for product ${order.product._id} scheduled to change to "Shipped" at ${oneMinuteFromNow}`
        // );

        // Schedule the status update to "Shipped"
        schedule.scheduleJob(oneMinuteFromNow, async () => {
          try {
            // Fetch the tourist again to ensure consistency
            const refreshedTourist = await touristModel
              .findById(tourist._id)
              .populate("purchasedProducts.product");
            const updatedOrder = refreshedTourist.purchasedProducts.find(
              (purchased) =>
                purchased.product &&
                purchased.product._id.toString() ===
                  order.product._id.toString()
            );

            if (updatedOrder) {
              updatedOrder.status = "Shipped";
              await refreshedTourist.save();
              // console.log(
              //   `Order status for product ${order.product._id} updated to "Shipped".`
              // );
            } else {
              // console.error(
              //   `Order for product ${order.product._id} not found in refreshed data.`
              // );
            }
          } catch (error) {
            console.error("Error updating order status:", error.message);
          }
        });
      });

      // Save the updated tourist with initial "Pending" statuses
      if (updated) {
        await tourist.save();
      }
    });
  } catch (error) {
    console.error("Error scheduling orders status update:", error.message);
  }
};

module.exports = scheduleAllOrdersStatusUpdate;
