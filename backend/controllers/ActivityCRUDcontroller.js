const { default: mongoose } = require("mongoose");
const Activity = require("../models/ActivityCRUD");
const Category = require("../models/CategoryCRUD");
const Advertiser = require("../models/AdverMODEL"); // Assuming this is the model for advertiser
const PrefTag = require("../models/preferanceTagsCRUD");
const User = require("../models/Tourist.js");
const  sendNotificationEmails  = require("../utils/tabbakh2");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with your secret key

const bookactivity = async (req, res) => {
  const { id } = req.params; // Extract the activity ID from the URL parameters
  const { userId, paymentMethod } = req.body; // Extract the user ID and payment method

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Activity ID." });
  }

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  const activity = await Activity.findById(id);
  if (activity.bookedUsers.includes(userId)) {
    return res.status(400).json({ message: "You have already booked this tour." });
  }

  try {
    
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    if (paymentMethod === "card") {
      // Create a PaymentIntent for the card payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: activity.price * 100, // Convert price to cents
        currency: "usd", // Set currency
        metadata: {
          activityId: id, // Add activity ID to metadata
          userId: userId, // Add user ID to metadata
        },
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: "Payment initiated. Confirm payment on the frontend.",
      });
    } else if (paymentMethod === "wallet") {
   
      // Check if the user has sufficient wallet balance
      if (user.Wallet < activity.price) {
        return res.status(400).json({
          message: "Insufficient wallet balance. Please top up your wallet.",
        });
      }

      // Deduct the activity price from the user's wallet
      user.Wallet -= activity.price;
      await user.save(); // Save the updated user balance

      // Finalize the booking
      await activity.incrementBookings(userId);

      res.status(200).json({ message: "Booking successful using wallet." });
    } else {
      res.status(400).json({ message: "Invalid payment method." });
    }
   } catch (error) {
    console.error("Error during booking:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
const finalizeActivityBooking = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  try {
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    if (activity.bookedUsers.includes(userId)) {
      return res.status(400).json({ message: "You have already booked this activity." });
    }

    await activity.incrementBookings(userId); // Add user to bookedUsers and increment bookings
    user.Loyalty_Points += calculateLoyaltyPoints(user.Loyalty_Level, activity.price);
    await user.save();
    res.status(200).json({ message: "Booking finalized successfully." });
  } catch (error) {
    console.error("Error finalizing booking:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
const adverModel = require('../models/AdverMODEL');
const sendEmailFlag = require('../utils/sendEmailFlag');

// Create Activity
const createActivity = async (req, res) => {
  try {
    // Ensure the provided category ID is valid
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // Ensure the provided advertiser ID is valid
    const advertiser = await Advertiser.findById(req.body.advertiser);
    if (!advertiser) {
      return res.status(400).json({ error: "Invalid advertiser" });
    }

    const tags = await PrefTag.findById(req.body.tags);
    if (!tags) {
      return res.status(400).json({ error: "Invalid tag" });
    }

    const activityData = {
      ...req.body,
      category: req.body.category,
      advertiser: req.body.advertiser, // Add advertiser to the activity
      tags: req.body.tags,
    };

    const activity = await Activity.create(activityData);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Activities with Category and Advertiser Populated
const getActivity = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("category", "name") // Populate the 'category' field with the 'name'
      .populate("advertiser", "UserName Email")
      .populate("tags"); // Populate the 'advertiser' field with the 'name'

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get a specific Activity by ID with populated category, advertiser, and tags
const getActivityById = async (req, res) => {
  const { id } = req.params; // Extract the activity ID from the URL parameters
  try {
    const activity = await Activity.findById(id)
      .populate("category", "name") // Populate 'category' with only 'name'
      .populate("advertiser", "Name") // Populate 'advertiser' with only 'Name'
      .populate("tags"); // Populate 'tags' with all fields
    res.status(200).json(activity); // Send the found activity as a response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle server errors
  }
};

const getBookedactivities = async (req, res) => {
  try {
    const { touristId } = req.query;
    // Validate touristId
    if (!touristId || !mongoose.isValidObjectId(touristId.trim())) {
      return res
        .status(400)
        .json({ message: "Invalid or missing Tourist ID." });
    }
    // Find all itineraries that the tourist has booked
    const bookedActivities = await Activity.find({
      bookedUsers: touristId.trim(),
    })
      .populate("category", "name") // Populate the 'category' field with the 'name'
      .populate("advertiser", "Name")
      .populate("tags"); // Populate the 'advertiser' field with the 'name'

    // Respond with the list of booked itineraries
    res.status(200).json(bookedActivities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Activity
const updateActivity = async (req, res) => {
  const { id } = req.params; // Get the activity ID from the request params
  const updateData = {};

  // Add fields to updateData if they exist in the request body
  if (req.body.date) updateData.date = req.body.date;
  if (req.body.time) updateData.time = req.body.time;
  if (req.body.location) updateData.location = req.body.location;
  if (req.body.price) updateData.price = req.body.price;

  if (req.body.category) {
    // Ensure the category ID is valid
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }
    updateData.category = req.body.category; // Set category ID
  }

  if (req.body.advertiser) {
    // Ensure the advertiser ID is valid
    const advertiser = await Advertiser.findById(req.body.advertiser);
    if (!advertiser) {
      return res.status(400).json({ error: "Invalid advertiser" });
    }
    updateData.advertiser = req.body.advertiser; // Set advertiser ID
  }

  if (req.body.tags) {
    // Ensure the tag ID is valid
    const tag = await PrefTag.findById(req.body.tags);
    if (!tag) {
      return res.status(400).json({ error: "Invalid tag" });
    }
    updateData.tags = req.body.tags; // Set advertiser ID
  }

  if (req.body.specialDiscount)
    updateData.specialDiscount = req.body.specialDiscount;
  if (req.body.isBookingOpen !== undefined)
    updateData.isBookingOpen = req.body.isBookingOpen;
  if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive; // Allow toggling isActive

  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensure validators run on updates
    )
      .populate("category", "name") // Populate category field
      .populate("advertiser", "UserName"); // Populate advertiser field

    if (!updatedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(updatedActivity); // Send updated activity as response
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const submitReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  const { activityId } = req.params;

  console.log("Received activityId:", activityId); // Debugging line

  try {
    // Find the activity by its ID
    const activity = await Activity.findById(activityId);
    if (!activity) {
      console.log("Activity not found"); // Debugging line
      return res.status(404).json({ message: "Activity not found" });
    }

    // Add the review to the activity
    activity.reviews.push({ userId, rating, comment });

    // Calculate the new average rating for the activity
    const totalRatings = activity.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    activity.rating = totalRatings / activity.reviews.length;

    // Save the updated activity
    await activity.save();

    return res.status(200).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error while submitting review:", error); // Debugging line
    return res.status(500).json({ message: "Server error" });
  }
};

// Other methods remain unchanged
const deleteActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedActivity = await Activity.findByIdAndDelete(id);
    if (!deletedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function calculateLoyaltyPoints(level, price) {
  let points = 0;

  if (level === 1) {
    points = price * 0.5;
  } else if (level === 2) {
    points = price * 1;
  } else if (level === 3) {
    points = price * 1.5;
  }

  console.log(`Points calculated for level ${level}: ${points}`); // Log calculated points
  return points;
}



const deleteAllActivities = async (req, res) => {
  try {
    await Activity.deleteMany({});
    res.status(200).json({ message: "All activities have been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const readAdverActivites = async (req, res) => {
  try {
    const userId = req.query.userId;
    const schemas = await Activity.find({
      advertiser: new mongoose.Types.ObjectId(userId),
    }).populate("advertiser");
    res.status(200).json(schemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const upcomingactivity = async (req, res) => {
  try {
    const now = new Date(); // Get the current date and time
    const upcomingActivities = await Activity.find({ date: { $gt: now } })
      .populate("category") // Optional: populate category details if needed
      .populate("advertiser") // Populate advertiser details if needed
      .sort({ date: 1 }); // Sort by date in ascending order

    if (upcomingActivities.length === 0) {
      return res.status(404).json({ message: "No upcoming activities found." });
    }

    res.json(upcomingActivities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching upcoming activities." });
  }
};

const cancelactivity = async (req, res) => {
  let { id } = req.params;
  const userId = req.body.userId;

  // Trim and validate the id parameter
  id = id.trim();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid itinerary ID format" });
  }

  try {
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Attempt to cancel the booking
    await activity.cancelBooking(userId);

    res.status(200).json({
      message: "Booking canceled successfully",
      bookings: activity.bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const flagActivity = async (req, res) => {
  const { id } = req.params;

  try {
    // Update the 'flagged' status to true
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { flagged: true },
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Fetch the advertiser's ID from the activity
    const advertiserId = updatedActivity.advertiser;

    // Use the getAdverById method to get the advertiser's email
    const advertiser = await adverModel.findById(advertiserId);

    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }

    const advertiserEmail = advertiser.Email; // Assuming the advertiser has an Email field
    const subject = "Your activity has been flagged";
    const text = `Dear Advertiser, your activity with ID ${id} has been flagged.`;

    await sendEmailFlag(advertiserEmail, subject, text);

    const notificationMessage = `Your activity with name ${updatedActivity.name} has been flagged.`;

    // Push the notification to the tour guide's Notifications array
    advertiser.Notifications.push(notificationMessage);
    await advertiser.save();

    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleActivation = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Toggling activation for activity ID:", id);

    const activity = await Activity.findById(id).populate(
      "notificationRequests",
      "Email UserName" // Only fetch the email field
    );

    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    activity.isActive = !activity.isActive; // Toggle activation
    await activity.save();

    if (activity.isActive) {
      console.log("Activity activated, sending emails to:", activity.notificationRequests);

      // Call the email sending function
      await sendNotificationEmails(activity.notificationRequests, activity.name);
    }
    

    res.status(200).json({ message: `Activity ${activity.isActive ? "activated" : "deactivated"}.` });
  } catch (error) {
    console.error("Error in toggleActivation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getBookedactivity = async (req, res) => {
  try {
    const { touristId } = req.query;
    // Validate touristId
    if (!touristId || !mongoose.isValidObjectId(touristId.trim())) {
      return res
        .status(400)
        .json({ message: "Invalid or missing Tourist ID." });
    }
    // Find all itineraries that the tourist has booked
    const bookedactivity = await Schema.find({
      bookedUsers: touristId.trim(),
    })
      .populate("Tags", "name");
    // Respond with the list of booked itineraries
    res.status(200).json(bookedactivity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const requestNotification = async (req, res) => {
  const { activityId } = req.params;
  const { userId } = req.body;

  console.log("Request received for activityId:", activityId, "userId:", userId);

  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    return res.status(400).json({ message: "Invalid Activity ID." });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid User ID." });
  }

  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Prevent duplicates
    if (activity.notificationRequests.includes(userId)) {
      return res.status(400).json({
        message: "You have already requested a notification for this activity.",
      });
    }

    // Add user ID to the array
    activity.notificationRequests = [...activity.notificationRequests, userId];
    await activity.save();

    res.status(200).json({ message: "Notification request submitted successfully!" });
  } catch (error) {
    console.error("Error adding notification request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



const getNotificationRequests = async (req, res) => {
  const { id } = req.params;

  // Log the received ID
  console.log("Fetching notification requests for activity ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid activity ID:", id);
    return res.status(400).json({ message: "Invalid Itinerary ID." });
  }

  try {
    // Attempt to find the itinerary
    const activity = await Activity.findById(id).populate(
      "notificationRequests", // Ensure this field exists in your schema
      "Email" // Populate user fields
    );

    // Log what we fetched from the database
    console.log("Fetched activity:", activity);

    if (!activity) {
      console.error("activity not found for ID:", id);
      return res.status(404).json({ message: "activity not found." });
    }

    // Check if `notificationRequests` is populated correctly
    if (!activity.notificationRequests) {
      console.warn("No notification requests found.");
      return res.status(200).json([]);
    }

    res.status(200).json(activity.notificationRequests);
  } catch (error) {
    console.error("Error fetching notification requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


module.exports = {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  deleteAllActivities,
  upcomingactivity,
  readAdverActivites,
  bookactivity,
  getActivityById,
  flagActivity,
  cancelactivity,
  getBookedactivities,
  submitReview,
  toggleActivation ,
  getBookedactivity ,
  requestNotification, 
  getNotificationRequests,

  finalizeActivityBooking
};
