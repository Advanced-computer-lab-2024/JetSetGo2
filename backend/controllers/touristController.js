const touristModel = require("../models/Tourist.js");
const ItenModel = require("../models/schematour.js");
const ActivityModel = require("../models/ActivityCRUD.js");
const AdminModel = require("../models/admin.js");
const SellerModel = require("../models/Seller.js");
const transportationModel = require("../models/TransportationCRUD.js");
const productModel = require("../models/ProductCRUD.js");
const { sendEmailToSeller } = require("../utils/prodoutstockmail"); // Import the email sending function
const museumModel = require("../models/MuseumCRUD.js");
const historicalModel = require("../models/HistoricalPlaceCRUD.js");
const Notification = require("../models/Notification.js");
const { default: mongoose } = require("mongoose");
const { json } = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Ensure Stripe is initialized

const bookTransportation = async (req, res) => {
  const { touristId, transportationId } = req.params;
  const { paymentMethod } = req.body;

  try {
    console.log("Booking Transportation:", {
      touristId,
      transportationId,
      paymentMethod,
    });

    // Check if touristId and transportationId are valid ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(touristId) ||
      !mongoose.Types.ObjectId.isValid(transportationId)
    ) {
      console.error("Error: Invalid touristId or transportationId.");
      return res
        .status(400)
        .json({ error: "Invalid tourist or transportation ID." });
    }

    // Find the transportation
    const transportation = await transportationModel.findById(transportationId);
    if (!transportation) {
      console.error("Error: Transportation not found.");
      return res.status(404).json({ error: "Transportation not found." });
    }
    console.log("Transportation found:", transportation);

    if (!transportation.isBookingOpen) {
      console.error("Error: Booking is closed for this transportation.");
      return res
        .status(400)
        .json({ error: "Booking is closed for this transportation." });
    }

    if (transportation.seatsAvailable <= 0) {
      console.error("Error: No available seats.");
      return res.status(400).json({ error: "No available seats." });
    }

    // Find the tourist
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      console.error("Error: Tourist not found.");
      return res.status(404).json({ error: "Tourist not found." });
    }
    console.log("Tourist found:", tourist);

    // Handle card payment
    if (paymentMethod === "card") {
      console.log("Initiating Stripe Payment...");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: transportation.price * 100, // Convert price to cents
        currency: "usd",
        metadata: {
          transportationId,
          touristId,
        },
      });
      console.log("Stripe Payment Initiated:", paymentIntent);

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: "Payment initiated. Confirm payment on the frontend.",
      });
    }
    // Handle wallet payment
    else if (paymentMethod === "wallet") {
      if (tourist.Wallet < transportation.price) {
        console.error("Error: Insufficient wallet balance.");
        return res.status(400).json({ error: "Insufficient wallet balance." });
      }

      console.log("Processing wallet payment...");
      tourist.Wallet -= transportation.price;
      transportation.seatsAvailable -= 1;

      if (transportation.seatsAvailable === 0) {
        transportation.isBookingOpen = false;
      }

      await transportation.save();
      await tourist.save();

      console.log("Wallet payment successful.");
      return res.status(200).json({
        message: "Transportation booked successfully using wallet.",
        tourist,
        transportation,
      });
    }
    // Handle invalid payment method
    else {
      console.error("Error: Invalid payment method.");
      return res.status(400).json({ error: "Invalid payment method." });
    }
  } catch (error) {
    console.error("Error during transportation booking:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
const finalizeTransportationBooking = async (req, res) => {
  const { transportationId } = req.params;
  const { userId, paymentIntentId } = req.body;

  try {
    console.log("Finalizing booking for Transportation:", {
      transportationId,
      userId,
      paymentIntentId,
    });

    // Validate transportationId and userId
    if (
      !mongoose.Types.ObjectId.isValid(transportationId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      console.error("Error: Invalid transportationId or userId.");
      return res
        .status(400)
        .json({ error: "Invalid transportation or user ID." });
    }

    // Validate transportation existence
    const transportation = await transportationModel.findById(transportationId);
    if (!transportation) {
      console.error("Error: Transportation not found.");
      return res.status(404).json({ error: "Transportation not found." });
    }
    console.log("Transportation found:", transportation);

    // Validate tourist existence
    const tourist = await touristModel.findById(userId);
    if (!tourist) {
      console.error("Error: Tourist not found.");
      return res.status(404).json({ error: "Tourist not found." });
    }
    console.log("Tourist found:", tourist);

    // Verify PaymentIntent status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
      console.error("Error: PaymentIntent not found.");
      return res.status(400).json({ error: "PaymentIntent not found." });
    }
    console.log("Retrieved PaymentIntent:", paymentIntent);

    if (paymentIntent.status !== "succeeded") {
      console.error(
        "Error: Payment not confirmed. Status:",
        paymentIntent.status
      );
      return res.status(400).json({
        error: `Payment not confirmed. Status: ${paymentIntent.status}`,
      });
    }

    // Prevent duplicate finalization

    // Finalize the booking
    transportation.seatsAvailable -= 1;
    if (transportation.seatsAvailable === 0) {
      transportation.isBookingOpen = false;
    }
    await transportation.save();

    tourist.bookedTransportations.push(transportationId);
    await tourist.save();

    console.log("Transportation booking finalized successfully.");
    res
      .status(200)
      .json({ message: "Transportation booking finalized successfully." });
  } catch (error) {
    console.error("Error finalizing transportation booking:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error.", details: error.message });
  }
};

const createTourist = async (req, res) => {
  // create a tourist after sign up
  const {
    Email,
    UserName,
    Password,
    MobileNumber,
    Nationality,
    DateOfBirth,
    Job,
  } = req.body;

  // Validation checks
  if (
    !Email ||
    !UserName ||
    !Password ||
    !MobileNumber ||
    !Nationality ||
    !DateOfBirth ||
    !Job
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Example: Validate Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(Email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Example: Validate MobileNumber (it should be a number and not less than 10 digits)
  if (isNaN(MobileNumber) || MobileNumber.toString().length < 10) {
    return res
      .status(400)
      .json({ error: "Mobile number must be at least 10 digits." });
  }

  // Example: Validate DateOfBirth (it should be a valid date)
  const dob = new Date(DateOfBirth);
  if (isNaN(dob.getTime())) {
    return res.status(400).json({ error: "Invalid date of birth." });
  }

  try {
    const tourist = await touristModel.create({
      Email,
      UserName,
      Password,
      MobileNumber,
      Nationality,
      DateOfBirth,
      Job,
      Admin_Acceptance: true,
    });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourist = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  if (req.body.Email) updateData.Email = req.body.Email;
  if (req.body.UserName) updateData.UserName = req.body.UserName;
  if (req.body.Password) updateData.Password = req.body.Password;
  if (req.body.MobileNumber) updateData.MobileNumber = req.body.MobileNumber;
  if (req.body.Nationality) updateData.Nationality = req.body.Nationality;
  if (req.body.DateOfBirth) updateData.DateOfBirth = req.body.DateOfBirth;
  if (req.body.Job) updateData.Job = req.body.Job;
  if (req.body.Wallet) updateData.Wallet = req.body.Wallet;
  try {
    const updatetourist = await touristModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatetourist) {
      res.status(404).json({ error: "Tourist not found" });
    }
    res.status(200).json(updatetourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTourist = async (req, res) => {
  try {
    const tourist = await touristModel.find({});
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.messege });
  }
};

const getTouristById = async (req, res) => {
  const { id } = req.params;
  try {
    const tourist = await touristModel.findById(id);
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTourist = async (req, res) => {
  console.log("Request to delete Tourist :", req.params.id); // Log the ID
  try {
    const { id } = req.params;
    const deletedTourist = await touristModel.findByIdAndDelete(id);

    if (!deletedTourist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedTourist,
    });
  } catch (error) {
    console.error("Error deleting tourism governor:", error);
    res.status(500).json({
      message: "Error deleting user",
      error,
    });
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

const buyProduct = async (req, res) => {
  const { touristId, productIds, addressId } = req.body;

  if (!touristId || !productIds || productIds.length === 0) {
    return res.status(400).json({ error: "Required data is missing." });
  }

  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    // Process each product
    for (const productId of productIds) {
      const product = await productModel.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json(`{ error: Product not found: ${productId} }`);
      }

      // Update product stock, add purchase record, etc.
      product.availableQuantity -= 1; // Example logic
      await product.save();

      // Add to tourist's purchase history
      tourist.purchasedProducts.push(productId);
    }

    // Save the tourist's updated information
    await tourist.save();

    res.status(200).json({ message: "Products purchased successfully." });
  } catch (error) {
    console.error("Error in buyProducts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const buyProducts = async (req, res) => {
  const { touristId, addressId } = req.body;

  if (!touristId || !addressId) {
    return res.status(400).json({ error: "Required data is missing." });
  }

  try {
    const tourist = await touristModel
      .findById(touristId)
      .populate("cart.product");
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    const cartItems = tourist.cart; // Get the items in the cart
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    const processedProducts = [];

    for (const cartItem of cartItems) {
      const product = cartItem.product;
      const quantity = cartItem.quantity;

      // Check stock availability
      if (product.availableQuantity < quantity) {
        return res.status(400).json({
          error: `Product '${product.description}' has insufficient stock. Available: ${product.availableQuantity}, Requested: ${quantity}`,
        });
      }

      // Deduct stock and save product
      product.availableQuantity -= quantity;
      await product.save();

      // Add product and quantity to the purchase history
      tourist.purchasedProducts.push({
        product: product._id,
        quantity,
      });

      processedProducts.push({ product, quantity });
    }

    // Clear the cart after successful purchase
    tourist.cart = [];
    await tourist.save();

    res.status(200).json({
      message: "Products purchased successfully.",
      processedProducts,
    });
  } catch (error) {
    console.error("Error in buyProducts:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getBookedTransportations = async (req, res) => {
  const { touristId } = req.params;

  try {
    // Find the tourist without population to check if the array is correct
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    console.log(
      "Booked Transportations before population:",
      tourist.bookedTransportations
    ); // Log the IDs to see if they are correct

    // Now populate the booked transportations
    const populatedTourist = await touristModel
      .findById(touristId)
      .populate("bookedTransportations");

    console.log(
      "Populated Booked Transportations:",
      populatedTourist.bookedTransportations
    ); // Log after population

    // Loop through the transportations and close the bookings for past dates
    const currentDate = new Date(); // Get the current date

    const updatedTransportations = populatedTourist.bookedTransportations.map(
      (transport) => {
        // Check if the transportation's date has passed
        const transportDate = new Date(transport.date); // Assuming transport.date is in a valid format

        // If the transportation's date has passed, close the booking
        if (transportDate < currentDate) {
          transport.isBookingOpen = false; // Close the booking
        }

        return transport;
      }
    );

    // Return the updated transportations (now with booking statuses updated)
    res.status(200).json(updatedTransportations);
  } catch (error) {
    console.error("Error fetching booked transportations:", error);
    res.status(500).json({ error: error.message });
  }
};

const getPurchasedProducts = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const populatedProducts = await Promise.all(
      tourist.purchasedProducts.map(async (purchasedItem) => {
        const product = await productModel.findById(purchasedItem.product);

        if (!product) {
          return null;
        }

        const seller = await SellerModel.findById(product.sellerId);
        const admin = await AdminModel.findById(product.sellerId);

        return {
          _id: purchasedItem._id, // Include the unique order ID
          product: {
            ...product.toObject(),
            sellerDetails: seller
              ? { name: seller.Name, role: "Seller" }
              : admin
              ? { name: admin.Username, role: "Admin" }
              : null,
          },
          quantity: purchasedItem.quantity,
          status: purchasedItem.status || "Pending",
        };
      })
    );

    const validProducts = populatedProducts.filter((item) => item !== null);

    res.status(200).json(validProducts);
  } catch (error) {
    console.error("Error fetching purchased products:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTouristNationality = async (req, res) => {
  const { touristId } = req.params;

  // Ensure touristId is a valid MongoDB ObjectId
  // if (!mongoose.Types.ObjectId.isValid(touristId)) {
  //   return res.status(400).json({ error: "Invalid tourist ID format" });
  // }

  try {
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res.status(200).json({ Nationality: tourist.Nationality });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAllTourist = async (req, res) => {
  try {
    await touristModel.deleteMany({});
    res.status(200).json({ message: "All tourist have been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const redeemPointsToCash = async (req, res) => {
  const userId = req.params.id; // Get userId from request parameters

  try {
    // Fetch the tourist (user) by ID
    const tourist = await touristModel.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const pointsToRedeem = tourist.Loyalty_Points; // Get the number of points to redeem from the request body

    const conversionRate = 10000; // 10,000 points = 100 EGP
    const cashEquivalent = (100 * pointsToRedeem) / conversionRate; // Calculate the cash equivalent

    // Deduct the points from the user's loyalty points
    tourist.Loyalty_Points -= pointsToRedeem;

    // Add the cash equivalent to the user's wallet
    tourist.Wallet += Math.floor(cashEquivalent); // Update wallet balance correctly

    // Save the updated tourist
    await tourist.save();

    res.status(200).json(`{
      message: Successfully redeemed ${pointsToRedeem} points for ${cashEquivalent} EGP,
      wallet: tourist.Wallet,
      loyaltyPointsRemaining: tourist.Loyalty_Points,
    }`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reqAccountToBeDeleted = async (req, res) => {
  const { id } = req.params;
  const currentDate = new Date();

  try {
    const bookeditineraries = await ItenModel.find({
      availableDates: { $gt: currentDate }, // Date is greater than the current date
      bookings: { $gt: 0 },
      bookedUsers: { $in: [id] },
    });

    if (bookeditineraries.length != 0) {
      return res.status(400).json({
        message:
          "Tourist cannot be deleted there are booked upcoming itenaries",
      });
    }

    const bookedactivities = await ActivityModel.find({
      date: { $gt: currentDate }, // Date is greater than the current date
      bookings: { $gt: 0 },
      bookedUsers: { $in: [id] },
    });

    if (bookedactivities.length != 0) {
      return res.status(400).json({
        message:
          "Tourist cannot be deleted there are booked upcoming activities",
      });
    }

    const trousittransportation = await touristModel.findById(id).populate({
      path: "bookedTransportations",
    });

    const bookedtransportation =
      trousittransportation.bookedTransportations.filter((transportaion) => {
        const transportaiondate = new Date(transportaion.date); // Convert the string date to Date object
        return transportaiondate >= currentDate;
      });

    if (bookedtransportation.length != 0) {
      return res.status(400).json({
        message:
          "Tourist cannot be deleted there are booked upcoming transportation",
      });
    }

    const touristflights = await touristModel.findById(id);

    // Filter the flights to only include upcoming ones
    const upcomingFlights = touristflights.bookedFlights.filter((flight) => {
      const departureDate = new Date(flight.date);
      return departureDate > currentDate;
    });

    if (upcomingFlights.length != 0) {
      return res.status(400).json({
        message: "Tourist cannot be deleted there are booked upcoming flights",
      });
    }

    const touristhotels = await touristModel
      .findById(id)
      .populate("bookedHotels");

    // Filter the hotels to only include those with a future check-in date
    const upcomingHotels = touristhotels.bookedHotels.filter((hotel) => {
      const checkinDate = new Date(hotel.offer.checkInDate);
      return checkinDate > currentDate;
    });

    if (upcomingHotels.length != 0) {
      return res.status(400).json({
        message: "Tourist cannot be deleted there are booked upcoming hotels",
      });
    }

    const bookedmuseum = await museumModel.find({
      availableDates: { $gt: currentDate }, // Date is greater than the current date
      bookings: { $gt: 0 },
      bookedUsers: { $in: [id] },
    });

    if (bookedmuseum.length != 0) {
      return res.status(400).json({
        message:
          "Tourist cannot be deleted there are booked upcoming events(Museum)",
      });
    }

    const bookedhistorical = await historicalModel.find({
      availableDates: { $gt: currentDate }, // Date is greater than the current date
      bookings: { $gt: 0 },
      bookedUsers: { $in: [id] },
    });

    if (bookedhistorical.length != 0) {
      return res.status(400).json({
        message:
          "Tourist cannot be deleted there are booked upcoming events(historical places)",
      });
    }

    await touristModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "tourist deleted succesfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching itineraries", error });
  }
};

// Method to add a rating
const addRating = async (req, res) => {
  const { rating } = req.body; // Get rating from the request body
  const { productId } = req.params; // Get productId from the URL parameter

  try {
    // Find the product by ID
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Add the rating to the ratings array
    product.ratings.push(rating);

    // Recalculate the average rating
    const totalRatings = product.ratings.length;
    const sumOfRatings = product.ratings.reduce((sum, rate) => sum + rate, 0);
    product.avgRating = sumOfRatings / totalRatings;

    // Save the updated product
    await product.save();

    return res.status(200).json(product); // Return the updated product
  } catch (error) {
    console.error("Error adding rating:", error.message);
    return res.status(500).json({ error: error.message }); // Return error response
  }
};

// Method to add a review
const addReview = async (req, res) => {
  const { review } = req.body; // Get review from the request body
  const { productId } = req.params; // Get productId from the URL parameter

  try {
    // Find the product by ID
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Add the review to the reviews array
    product.reviewsText.push(review);

    // Save the updated product
    await product.save();

    return res.status(200).json(product); // Return the updated product
  } catch (error) {
    console.error("Error adding review:", error.message);
    return res.status(500).json({ error: error.message }); // Return error response
  }
};
// Method to get bookmarked historical places

// Method to get bookmarked museums

const getBookmarkedActivities = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await touristModel
      .findById(touristId)
      .populate("bookmarkedActivities");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res
      .status(200)
      .json({ bookmarkedActivities: tourist.bookmarkedActivities });
  } catch (error) {
    console.error("Error fetching bookmarked activities:", error);
    res.status(500).json({ error: error.message });
  }
};
const toggleBookmarkActivity = async (req, res) => {
  const { touristId, activityId } = req.params;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const isBookmarked = tourist.bookmarkedActivities.includes(activityId);
    if (isBookmarked) {
      tourist.bookmarkedActivities = tourist.bookmarkedActivities.filter(
        (id) => id.toString() !== activityId
      );
    } else {
      tourist.bookmarkedActivities.push(activityId);
    }

    await tourist.save();

    res.status(200).json({
      message: isBookmarked
        ? "Activity removed from bookmarks."
        : "Activity added to bookmarks.",
      bookmarkedActivities: tourist.bookmarkedActivities,
    });
  } catch (error) {
    console.error("Error handling bookmark:", error);
    res.status(500).json({ error: error.message });
  }
};
const getBookmarkedItineraries = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await touristModel
      .findById(touristId)
      .populate("bookmarkedItineraries");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res
      .status(200)
      .json({ bookmarkedItineraries: tourist.bookmarkedItineraries });
  } catch (error) {
    console.error("Error fetching bookmarked itineraries:", error.message);
    res.status(500).json({ error: error.message });
  }
};
const toggleBookmarkItinerary = async (req, res) => {
  const { touristId, itineraryId } = req.params;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const isBookmarked = tourist.bookmarkedItineraries.includes(itineraryId);
    if (isBookmarked) {
      // Remove itinerary from bookmarks
      tourist.bookmarkedItineraries = tourist.bookmarkedItineraries.filter(
        (id) => id.toString() !== itineraryId
      );
    } else {
      // Add itinerary to bookmarks
      tourist.bookmarkedItineraries.push(itineraryId);
    }

    await tourist.save();

    res.status(200).json({
      message: isBookmarked
        ? "Itinerary removed from bookmarks."
        : "Itinerary added to bookmarks.",
      bookmarkedItineraries: tourist.bookmarkedItineraries,
    });
  } catch (error) {
    console.error("Error handling bookmark itinerary:", error);
    res.status(500).json({ error: error.message });
  }
};
const getBookmarkedHistoricalPlaces = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await touristModel
      .findById(touristId)
      .populate("bookmarkedHistoricalPlaces");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res.status(200).json(tourist.bookmarkedHistoricalPlaces);
  } catch (error) {
    console.error(
      "Error fetching bookmarked historical places:",
      error.message
    );
    res.status(500).json({ error: error.message });
  }
};
const toggleBookmarkHistoricalPlace = async (req, res) => {
  const { touristId, historicalPlaceId } = req.params;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const isBookmarked =
      tourist.bookmarkedHistoricalPlaces.includes(historicalPlaceId);
    if (isBookmarked) {
      // Remove historical place from bookmarks
      tourist.bookmarkedHistoricalPlaces =
        tourist.bookmarkedHistoricalPlaces.filter(
          (id) => id.toString() !== historicalPlaceId
        );
    } else {
      // Add historical place to bookmarks
      tourist.bookmarkedHistoricalPlaces.push(historicalPlaceId);
    }

    await tourist.save();

    res.status(200).json({
      message: isBookmarked
        ? "Historical Place removed from bookmarks."
        : "Historical Place added to bookmarks.",
      bookmarkedHistoricalPlaces: tourist.bookmarkedHistoricalPlaces,
    });
  } catch (error) {
    console.error("Error handling bookmark historical place:", error);
    res.status(500).json({ error: error.message });
  }
};
const getBookmarkedMuseums = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await touristModel
      .findById(touristId)
      .populate("bookmarkedMuseums");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    res.status(200).json({ bookmarkedMuseums: tourist.bookmarkedMuseums });
  } catch (error) {
    console.error("Error fetching bookmarked museums:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const toggleBookmarkMuseum = async (req, res) => {
  const { touristId, museumId } = req.params;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const isBookmarked = tourist.bookmarkedMuseums.includes(museumId);
    if (isBookmarked) {
      // Remove from bookmarks
      tourist.bookmarkedMuseums = tourist.bookmarkedMuseums.filter(
        (id) => id.toString() !== museumId
      );
    } else {
      // Add to bookmarks
      tourist.bookmarkedMuseums.push(museumId);
    }

    await tourist.save();

    res.status(200).json({
      message: isBookmarked
        ? "Museum removed from bookmarks."
        : "Museum added to bookmarks.",
      bookmarkedMuseums: tourist.bookmarkedMuseums,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  const { touristId, productId } = req.params;

  try {
    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(touristId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid tourist ID or product ID" });
    }

    // Find the tourist
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Initialize `cart` if not already an array
    if (!Array.isArray(tourist.cart)) {
      tourist.cart = [];
    }

    // Find the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the product is out of stock
    if (product.availableQuantity <= 0) {
      return res
        .status(400)
        .json({ error: `Product '${product.description}' is out of stock.` });
    }

    // Check if the product already exists in the cart
    const existingCartItem = tourist.cart.find(
      (cartItem) =>
        cartItem.product && cartItem.product.toString() === productId
    );

    if (existingCartItem) {
      // If the product is already in the cart, increment the quantity
      existingCartItem.quantity += 1;
    } else {
      // Otherwise, add the product with a default quantity of 1
      tourist.cart.push({ product: product._id, quantity: 1 });
    }

    // Save the updated tourist document
    await tourist.save();

    return res
      .status(200)
      .json({ message: "Product added to cart", cart: tourist.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  const { touristId } = req.params;

  try {
    // Find the tourist and populate the cart
    const tourist = await touristModel
      .findById(touristId)
      .populate("cart.product");
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Transform the cart for the response
    const cartItems = tourist.cart.map((cartItem) => ({
      product: cartItem.product,
      quantity: cartItem.quantity,
    }));

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { touristId, productId } = req.params;

  try {
    // Find the tourist
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Filter out the product from the cart
    tourist.cart = tourist.cart.filter(
      (item) => item.product.toString() !== productId
    );

    // Save the updated tourist document
    await tourist.save();

    res
      .status(200)
      .json({ message: "Product removed from cart", cart: tourist.cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  const { touristId, productId, quantity } = req.body;

  try {
    // Fetch the tourist
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Fetch the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Validate the requested quantity
    if (quantity > product.availableQuantity) {
      return res.status(400).json({
        error: `Requested quantity exceeds available stock. Only ${product.availableQuantity} left.`,
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1.",
      });
    }

    // Ensure tourist.cart exists and is an array
    if (!Array.isArray(tourist.cart)) {
      return res
        .status(400)
        .json({ error: "Cart is not initialized or invalid." });
    }

    // Find the cart item
    const cartItem = tourist.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: "Cart quantity updated successfully",
      cart: tourist.cart,
    });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ error: error.message });
  }
};

const addDeliveryAddress = async (req, res) => {
  const { touristId } = req.params;
  const { address, city, state, postalCode, country } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    const newAddress = { address, city, state, postalCode, country };
    tourist.deliveryAddresses.push(newAddress);

    await tourist.save();

    res.status(200).json({
      message: "Address added successfully",
      addresses: tourist.deliveryAddresses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTouristAddresses = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the request parameters

  try {
    // Fetch the tourist by ID
    const tourist = await touristModel.findById(userId);

    // Check if the tourist exists
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Return the deliveryAddresses field
    res.status(200).json(tourist.deliveryAddresses || []); // Return an empty array if no addresses exist
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.params; // Get user ID from the request params

  try {
    const tourist = await touristModel.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the product already exists in the wishlist
    if (tourist.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    tourist.wishlist.push(productId);
    await tourist.save();

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: tourist.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const tourist = await touristModel.findById(userId).populate("wishlist"); // Populate wishlist with product details
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ wishlist: tourist.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.params;

  try {
    const tourist = await touristModel.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Remove product from wishlist
    tourist.wishlist = tourist.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await tourist.save();

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: tourist.wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const cancelOrder = async (req, res) => {
  const { touristId, orderId } = req.params;

  console.log("Received touristId:", touristId);
  console.log("Received orderId:", orderId);

  // Validate both IDs
  const isTouristIdValid = mongoose.Types.ObjectId.isValid(touristId);
  const isOrderIdValid = mongoose.Types.ObjectId.isValid(orderId);

  console.log("Is touristId valid?", isTouristIdValid);
  console.log("Is orderId valid?", isOrderIdValid);

  if (!isTouristIdValid || !isOrderIdValid) {
    return res
      .status(400)
      .json({ error: "Invalid tourist or order ID format." });
  }

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      console.log("Tourist not found.");
      return res.status(404).json({ error: "Tourist not found." });
    }

    console.log("Tourist found:", tourist);

    const order = tourist.purchasedProducts.id(orderId);
    if (!order) {
      console.log("Order not found.");
      return res.status(404).json({ error: "Order not found." });
    }

    console.log("Order found:", order);

    // Remove order and save
    tourist.purchasedProducts.remove(order);
    await tourist.save();

    res.status(200).json({ message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createTourist,
  updateTourist,
  getTourist,
  getTouristById,
  deleteTourist,
  deleteAllTourist,
  bookTransportation,
  getBookedTransportations,
  getTouristNationality,
  buyProduct,
  getPurchasedProducts,
  addRating,
  addReview,
  addToWishlist,
  redeemPointsToCash,
  reqAccountToBeDeleted,
  getBookmarkedActivities,
  getBookmarkedItineraries,
  getBookmarkedHistoricalPlaces,
  getBookmarkedMuseums,
  toggleBookmarkActivity,
  toggleBookmarkItinerary,
  toggleBookmarkHistoricalPlace,
  toggleBookmarkMuseum,
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  addDeliveryAddress,
  getTouristAddresses,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  buyProducts,
  finalizeTransportationBooking,
  cancelOrder,
};
