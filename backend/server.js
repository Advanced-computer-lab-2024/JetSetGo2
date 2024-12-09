const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const scheduleBirthdayEmails = require("./birthdayScheduler");


const scheduleActivityNotificationss = require("./activiteSchedular.js");

const itenarynotification = require("./notificationScheduler.js");
const changeorderstatus = require("./changeorderstatus.js");
const cron = require("node-cron");

const MongoURI = process.env.MONGO_URI;

// Import models
const Tourist = require("./models/Tourist");
const TourGouvnerTagSearch = require("./models/tourismGovernerTags.js");
const Museum = require("./models/MuseumCRUD.js");
const HistoricalPlace = require("./models/HistoricalPlaceCRUD.js");
const Activity = require("./models/ActivityCRUD.js");
const Category = require("./models/CategoryCRUD.js");
const Itinerary = require("./models/schematour.js");
const PreferenceTagSearch = require("./models/preferanceTagsCRUD.js");
const validatePromoCode =
  require("./controllers/promoCodeController.js").validatePromoCode; // Ensure you import the validation function

// Import routes
const activityRoutes = require("./routes/ActivityCRUDroute");
const historicalPlaceRoutes = require("./routes/HistoricalPlaceCRUDroute");
const museumRoutes = require("./routes/MuseumCRUDroute");
const itineraryRoutes = require("./routes/SchemaTourRoutes");
const touristRoutes = require("./routes/touristRoutes");
const otherRoutes = require("./routes/otherRoutes");
const preferanceTagsRoutes = require("./routes/preferanceTagsRoutes");
const TourGuideRoute = require("./routes/TGuideRoutes.js");
const categoryRoutes = require("./routes/CategoryCRUDroute");
const productRoutes = require("./routes/ProductCRUDroute");
const tourismGovernorTagsRoutes = require("./routes/tourismGovernerTags");
const sellerRoutes = require("./routes/SellerRoute");
const tourismGovernorRoutes = require("./routes/tourismGovernorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const AdvertiserRoutes = require("./routes/AdverRoutes.js");
const loginRoutes = require("./routes/authRoutes.js");
const transportationRoutes = require("./routes/TransportationCRUDroute.js");
const complaintRoutes = require("./routes/complaintRoutes.js");
const otpRoutes = require("./routes/otpRoutes.js");
const promoCodeRoutes = require("./routes/promoCodeRoutes");
const notificationRoutes = require("./routes/notificationRoutes.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const SalesReportRoutes = require("./routes/SalesReportRoute.js");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port = process.env.PORT || "8000";

// Connect to MongoDB
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Start the birthday scheduler
    scheduleBirthdayEmails();
    itenarynotification();
    scheduleActivityNotificationss();
    changeorderstatus();    
    // Start server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

// Middleware for authenticating JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Store the user ID for later use
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Example protected route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the protected route!", userId: req.userId });
});


app.use("/itinerary", itineraryRoutes);
app.use("/", touristRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use('/activity', activityRoutes); 
app.use("/api/seller", sellerRoutes); // Use seller routes
app.use("/api", AdvertiserRoutes);
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

// In your backend (e.g., Node.js/Express)
app.post("/home/tourist/bookFlight", async (req, res) => {
  try {
    const { touristId, flight, paymentMethod, paymentIntentId, promoCode } =
      req.body;
    let flightPrice = parseFloat(flight?.price?.total);

    if (isNaN(flightPrice)) {
      flightPrice = parseFloat(flight?.price);
    }

    if (isNaN(flightPrice)) {
      throw new Error("Invalid flight price provided.");
    }
    // Step 1: Validate tourist existence
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Calculate the price
    let discountedPrice = flightPrice;

    // Validate and apply promo code (if provided)
    if (promoCode) {
      console.log("promo check");
      const validation = await validatePromoCode(promoCode);

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const { discountType, discountValue } = validation;

      // Apply the discount
      if (discountType === "percentage") {
        discountedPrice =
          flight.price.total - (flight.price.total * discountValue) / 100;
      } else if (discountType === "fixed") {
        discountedPrice = flight.price.total - discountValue;
      }

      // Ensure discounted price is not less than zero
      if (discountedPrice < 0) discountedPrice = 0;

      console.log(`Promo code applied. Discounted price: ${discountedPrice}`);
    }

    // Step 2: Handle payment logic
    if (paymentMethod === "card") {
      if (!paymentIntentId) {
        // console.log("Initiating Stripe payment...");
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(parseFloat(discountedPrice) * 100), // Convert price to cents
          currency: "usd",
          metadata: { touristId, ...flight, promoCode: promoCode || "N/A" },
        });
        return res.status(200).json({
          clientSecret: paymentIntent.client_secret,
          message: "Payment initiated. Confirm payment on the frontend.",
        });
      }
      console.log("Flight price =", flight.price.total);
      const verifiedPaymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (verifiedPaymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment not confirmed. Status: ${verifiedPaymentIntent.status}`,
        });
      }
      const loyaltyPoints = calculateLoyaltyPoints(
        tourist.Loyalty_Level,
        flightPrice
      );

      tourist.Loyalty_Points += loyaltyPoints;
      tourist.Total_Loyalty_Points += loyaltyPoints;
      // Update loyalty level
      if (tourist.Total_Loyalty_Points >= 500000) {
        tourist.Loyalty_Level = 3;
      } else if (tourist.Total_Loyalty_Points >= 100000) {
        tourist.Loyalty_Level = 2;
      } else {
        tourist.Loyalty_Level = 1;
      }
      // console.log("Payment confirmed:", verifiedPaymentIntent);
    } else if (paymentMethod === "wallet") {
      if (tourist.Wallet == 0) {
        return res
          .status(400)
          .json({ message: "Insufficient wallet balance." });
      } else if (tourist.Wallet < flightPrice) {
        return res
          .status(400)
          .json({ message: "Insufficient wallet balance." });
      }

      tourist.Wallet -= discountedPrice;
      // console.log("Wallet payment processed.");
    } else {
      return res.status(400).json({ message: "Invalid payment method." });
    }

    console.log(flight);

    // Step 3: Finalize flight booking
    console.log("Finalizing flight booking...");
    tourist.bookedFlights.push(flight);

    await tourist.save();

    console.log("Flight booking finalized successfully.", discountedPrice);
    res
      .status(200)
      .json({ message: "Flight booked successfully.", discountedPrice });
  } catch (error) {
    console.error("Error booking flight:", error);
    res
      .status(500)
      .json({ message: "Error booking flight.", details: error.message });
  }
});

app.get("/home/tourist/bookedFlights/:touristId", async (req, res) => {
  try {
    const { touristId } = req.params;

    // Assuming you have a Tourist model
    const tourist = await Tourist.findById(touristId).select("bookedFlights");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json(tourist.bookedFlights);
  } catch (error) {
    console.error("Error fetching booked flights:", error);
    res.status(500).json({ message: "Error fetching booked flights" });
  }
});

// Define your routes here

// Register the payment routes AFTER the raw body middleware

// Use raw body parsing specifically for Stripe webhook
app.use("/activity", activityRoutes);
app.use("/historicalPlace", historicalPlaceRoutes);
app.use("/museum", museumRoutes);
app.use("/category", categoryRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/product", productRoutes);
app.use("/home/tourist", touristRoutes);
app.use("/home/other", otherRoutes);
app.use("/prefTags", preferanceTagsRoutes);
app.use("/TourGuide", TourGuideRoute);
app.use("/home/adver", AdvertiserRoutes);
app.use("/TourismTags", tourismGovernorTagsRoutes);
app.use("/Seller", sellerRoutes);
app.use("/tourism", tourismGovernorRoutes);
app.use("/admin", adminRoutes);
app.use("/login", loginRoutes);
app.use("/transportation", transportationRoutes);
app.use("/complaint", complaintRoutes);
app.use("/otp", otpRoutes);
app.use("/promo", promoCodeRoutes);
app.use("/notifications", notificationRoutes);
app.use("/SalesReport", SalesReportRoutes);


// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//const Tourist = require('../models/Tourist');

app.post("/home/tourist/:touristId/bookHotel", async (req, res) => {
  const { touristId } = req.params;
  const { offer, hotelName, paymentMethod, paymentIntentId } = req.body;
  const hotelPrice = offer?.price?.total;

  try {
    if (!offer || !hotelName || !paymentMethod) {
      throw new Error(
        "Missing required fields: offer, hotelName, or paymentMethod"
      );
    }

    // Step 1: Validate tourist existence
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Step 2: Handle payment logic
    if (paymentMethod === "card") {
      if (!paymentIntentId) {
        console.log("Initiating Stripe payment...");

        // Stringify object-like metadata values
        const metadata = {
          touristId: String(touristId),
          hotelName: String(hotelName),
          checkInDate: offer.checkInDate,
          checkOutDate: offer.checkOutDate,
          roomType: offer.room?.typeEstimated?.category || "N/A",
          guests: String(offer.guests?.adults || "1"),
          rateFamilyEstimated: JSON.stringify(offer.rateFamilyEstimated || {}),
          priceTotal: String(hotelPrice),
        };

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(parseFloat(hotelPrice) * 100), // Convert price to cents
          currency: "usd",
          metadata, // Ensure metadata values are strings
        });

        console.log("Payment Intent Created:", paymentIntent);

        return res.status(200).json({
          clientSecret: paymentIntent.client_secret,
          message: "Payment initiated. Confirm payment on the frontend.",
        });
      }

      console.log("Verifying payment...");
      const verifiedPaymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (verifiedPaymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment not confirmed. Status: ${verifiedPaymentIntent.status}`,
        });
      }

      console.log("Payment confirmed:", verifiedPaymentIntent);
      const loyaltyPoints = calculateLoyaltyPoints(
        tourist.Loyalty_Level,
        hotelPrice
      );

      if (isNaN(loyaltyPoints) || loyaltyPoints < 0) {
        throw new Error("Invalid loyalty points calculated.");
      }

      tourist.Loyalty_Points += loyaltyPoints;
      tourist.Total_Loyalty_Points += loyaltyPoints;

      // Update loyalty level
      if (tourist.Total_Loyalty_Points >= 500000) {
        tourist.Loyalty_Level = 3;
      } else if (tourist.Total_Loyalty_Points >= 100000) {
        tourist.Loyalty_Level = 2;
      } else {
        tourist.Loyalty_Level = 1;
      }
    } else if (paymentMethod === "wallet") {
      if (tourist.Wallet == 0) {
        return res
          .status(400)
          .json({ message: "Insufficient wallet balance." });
      } else if (tourist.Wallet < hotelPrice) {
        return res
          .status(400)
          .json({ message: "Insufficient wallet balance." });
      }

      tourist.Wallet -= hotelPrice;
      console.log("Wallet payment processed.");
    } else {
      return res.status(400).json({ message: "Invalid payment method." });
    }

    // Step 3: Finalize hotel booking
    console.log("Finalizing hotel booking...");
    const bookedData = { hotelName, offer };
    tourist.bookedHotels.push(bookedData);

    await tourist.save();

    console.log("Hotel booking finalized successfully.");
    res.status(200).json({ message: "Hotel booked successfully." });
  } catch (error) {
    console.error("Error booking hotel:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "Error booking hotel.", details: error.message });
  }
});

app.get("/home/tourist/bookedHotels/:touristId", async (req, res) => {
  try {
    const { touristId } = req.params;

    // Assuming you have a Tourist model
    const tourist = await Tourist.findById(touristId).select("bookedHotels");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json(tourist.bookedHotels);
  } catch (error) {
    console.error("Error fetching booked hotels:", error);
    res.status(500).json({ message: "Error fetching booked hotels" });
  }
});

// Search
app.get("/search", async (req, res) => {
  const { searchword, searchType } = req.query; // Add searchType to query parameters

  if (!searchword || !searchType) {
    return res.status(400).json({
      message: "Both Search Word and Search Type parameters are required.",
    });
  }

  try {
    const regex = new RegExp(searchword, "i");
    let searchResults = {
      Museums: [],
      HistoricalPlace: [],
      activities: [],
      itinaries: [],
    };

    if (searchType === "name") {
      // Search by name for museums or historical places or itineraries
      const tourismTags = await TourGouvnerTagSearch.find({ name: regex });
      const tagIds = tourismTags.map((tag) => tag._id);

      searchResults.Museums = await Museum.find({
        tourismGovernerTags: { $in: tagIds },
      }).populate("tourismGovernerTags");

      searchResults.HistoricalPlace = await HistoricalPlace.find({
        tourismGovernerTags: { $in: tagIds },
      }).populate("tourismGovernerTags");

      searchResults.itinaries = await Itinerary.find({ name: regex });
    } else if (searchType === "category") {
      // Search activities by category name
      const categories = await Category.find({ name: regex });
      const categoryIds = categories.map((category) => category._id);
      searchResults.activities = await Activity.find({
        category: { $in: categoryIds },
      }).populate("category");
    } else if (searchType === "tags") {
      // Search for Museum/Historical or Activities or itineraries by tags
      const tourismTags = await TourGouvnerTagSearch.find({ type: regex });
      const tagIds = tourismTags.map((tag) => tag._id);

      searchResults.Museums = await Museum.find({
        tourismGovernerTags: { $in: tagIds },
      }).populate("tourismGovernerTags");

      searchResults.HistoricalPlace = await HistoricalPlace.find({
        tourismGovernerTags: { $in: tagIds },
      }).populate("tourismGovernerTags");

      const prefTags = await PreferenceTagSearch.find({ name: regex });
      const prefIds = prefTags.map((pref) => pref._id);

      searchResults.activities = await Activity.find({
        tags: { $in: prefIds },
      });
      searchResults.itinaries = await Itinerary.find({
        Tags: { $in: prefIds },
      });
    } else {
      return res.status(400).json({ message: "Invalid Search Type." });
    }
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
