const touristModel = require("../models/Tourist.js");
const ItenModel = require("../models/schematour.js");
const ActivityModel = require("../models/ActivityCRUD.js");
const transportationModel = require("../models/TransportationCRUD.js");
const productModel = require("../models/ProductCRUD.js");
const museumModel = require("../models/MuseumCRUD.js");
const historicalModel = require("../models/HistoricalPlaceCRUD.js");
const { default: mongoose } = require("mongoose");

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

const bookTransportation = async (req, res) => {
  const { touristId, transportationId } = req.params;

  try {
    const transportation = await transportationModel.findById(transportationId);

    if (!transportation) {
      return res.status(404).json({ error: "Transportation not found" });
    }

    if (!transportation.isBookingOpen) {
      return res
        .status(400)
        .json({ error: "Booking is closed for this transportation." });
    }

    if (transportation.seatsAvailable <= 0) {
      return res.status(400).json({ error: "No available seats." });
    }

    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Decrement seat and close booking if seats reach 0
    transportation.seatsAvailable -= 1;
    if (transportation.seatsAvailable === 0) {
      transportation.isBookingOpen = false; // Close booking when no seats are left
    }
    await transportation.save();

    // Add the booked transportation to the tourist's bookings
    tourist.bookedTransportations.push(transportation._id);

    // Use the existing calculateLoyaltyPoints function
    const loyaltyPoints = calculateLoyaltyPoints(
      tourist.Loyalty_Level,
      transportation.price
    );

    // Add loyalty points to the user's account
    user.Loyalty_Points = user.Loyalty_Points + loyaltyPoints;
    user.Total_Loyalty_Points = user.Total_Loyalty_Points + loyaltyPoints;

    if (user.Total_Loyalty_Points >= 500000) {
      user.Loyalty_Level = 3;
    } else if (user.Total_Loyalty_Points >= 100000) {
      user.Loyalty_Level = 2;
    } else {
      user.Loyalty_Level = 1;
    }

    await tourist.save();

    res.status(200).json({
      message: "Transportation booked successfully",
      transportation,
      tourist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const buyProduct = async (req, res) => {
  const { touristId, productId } = req.params;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    if (product.availableQuantity <= 0) {
      return res.status(400).json({ error: "No available seats." });
    }

    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Decrement seat and close booking if seats reach 0
    product.availableQuantity -= 1;
    product.sales += 1;

    await product.save();

    // Add the booked transportation to the tourist's bookings
    tourist.purchasedProducts.push(product._id);
    await tourist.save();

    res.status(200).json({
      message: "Transportation booked successfully",
      product,
      tourist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    // Find the tourist and ensure the tourist exists
    const tourist = await touristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    console.log(
      "Purchased products before population:",
      tourist.purchasedProducts
    );

    // Populate the purchased products
    const populatedTourist = await touristModel
      .findById(touristId)
      .populate("purchasedProducts"); // Ensure 'purchasedProducts' matches the field name in schema

    console.log(
      "Populated Purchased Products:",
      populatedTourist.purchasedProducts
    );

    // Check if the population was successful
    if (
      !populatedTourist.purchasedProducts ||
      populatedTourist.purchasedProducts.length === 0
    ) {
      return res
        .status(200)
        .json({ message: "No purchased products found for this tourist." });
    }

    // Send the populated purchased products as a response
    res.status(200).json(populatedTourist.purchasedProducts);
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

    res.status(200).json({
      message: `Successfully redeemed ${pointsToRedeem} points for ${cashEquivalent} EGP`,
      wallet: tourist.Wallet,
      loyaltyPointsRemaining: tourist.Loyalty_Points,
    });
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
const addToCart = async (req, res) => {
  const { touristId, productId } = req.params;

  try {
      const tourist = await touristModel.findById(touristId);
      const product = await productModel.findById(productId);

      if (!tourist || !product) {
          return res.status(404).json({ error: "Tourist or Product not found" });
      }

      if (!tourist.cart.includes(productId)) {
          tourist.cart.push(productId);
          await tourist.save();
          return res.status(200).json({ message: "Product added to cart", cart: tourist.cart });
      } else {
          return res.status(400).json({ message: "Product already in cart" });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
const getCart = async (req, res) => {
  const { touristId } = req.params;

  try {
      const tourist = await touristModel.findById(touristId).populate("cart");
      if (!tourist) {
          return res.status(404).json({ error: "Tourist not found" });
      }
      res.status(200).json(tourist.cart);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
const removeFromCart = async (req, res) => {
  const { touristId, productId } = req.params;

  try {
      const tourist = await touristModel.findById(touristId);
      if (!tourist) {
          return res.status(404).json({ error: "Tourist not found" });
      }

      tourist.cart = tourist.cart.filter((item) => item.toString() !== productId);
      await tourist.save();
      res.status(200).json({ message: "Product removed from cart", cart: tourist.cart });
  } catch (error) {
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
    if (!tourist.cart || !Array.isArray(tourist.cart)) {
      return res.status(400).json({ error: "Cart is not initialized or invalid." });
    }
    if (!tourist.cart || tourist.cart.length === 0) {
      return res.status(404).json({ error: "Cart is empty or not initialized" });
    }
    

    // Find the cart item
    const cartItem = tourist.cart.find(
      (item) => item.toString() === productId // Compare directly if it's a reference
    );
    

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Save the updated tourist
    await tourist.save();

    res.status(200).json({ message: "Cart quantity updated successfully", cart: tourist.cart });
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

    res.status(200).json({ message: "Address added successfully", addresses: tourist.deliveryAddresses });
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
  redeemPointsToCash,
  reqAccountToBeDeleted,
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  addDeliveryAddress,
  getTouristAddresses,
};
