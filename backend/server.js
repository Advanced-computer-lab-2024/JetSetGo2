const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const scheduleBirthdayEmails = require("./birthdayScheduler");
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

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port = process.env.PORT || "8000";

const updateOrderStatuses = async () => {
  try {
    const tourists = await Tourist.find({});
    const currentDate = new Date();

    for (const tourist of tourists) {
      for (const order of tourist.purchasedProducts) {
        if (order.status === "Upcoming" && order.shippingDate && new Date(order.shippingDate) <= currentDate) {
          order.status = "Shipped"; // Update to shipped if the shipping date has passed
        }
        if (order.status === "Shipped" && order.deliveredDate && new Date(order.deliveredDate) <= currentDate) {
          order.status = "Delivered"; // Update to delivered if the delivery date has passed
        }
      }
      await tourist.save(); // Save the updated tourist document
    }

    console.log("Order statuses updated successfully.");
  } catch (error) {
    console.error("Error updating order statuses:", error);
  }
};

// Schedule the job to run daily at midnight
cron.schedule("*/5 * * * *", updateOrderStatuses);

// Connect to MongoDB
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Start the birthday scheduler
    scheduleBirthdayEmails();

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
    const { touristId, flight } = req.body;

    // Assuming you have a Tourist model/schema in your database
    const tourist = await Tourist.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Add the flight to the tourist's booked flights
    tourist.bookedFlights.push(flight);

    // Use the existing calculateLoyaltyPoints function
    const loyaltyPoints = calculateLoyaltyPoints(
      tourist.Loyalty_Level,
      flight.price
    );

    // Add loyalty points to the user's account
    tourist.Loyalty_Points = tourist.Loyalty_Points + loyaltyPoints;
    tourist.Total_Loyalty_Points = tourist.Total_Loyalty_Points + loyaltyPoints;

    if (tourist.Total_Loyalty_Points >= 500000) {
      tourist.Loyalty_Level = 3;
    } else if (tourist.Total_Loyalty_Points >= 100000) {
      tourist.Loyalty_Level = 2;
    } else {
      tourist.Loyalty_Level = 1;
    }

    await tourist.save();

    res.status(200).json({ message: "Flight booked successfully" });
  } catch (error) {
    console.error("Error booking flight:", error);
    res.status(500).json({ message: "Error booking flight" });
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

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//const Tourist = require('../models/Tourist');

app.post("/home/tourist/:touristId/bookHotel", async (req, res) => {
  const { touristId } = req.params;
  const { offer, hotelName } = req.body; // Destructure hotelName from the request body

  try {
    const tourist = await Tourist.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const bookedData = { hotelName, offer }; // Combine hotelName with the offer
    tourist.bookedHotels.push(bookedData); // Add the combined data to bookedHotels

    // Use the existing calculateLoyaltyPoints function
    const loyaltyPoints = calculateLoyaltyPoints(
      tourist.Loyalty_Level,
      bookedData.offer.price.total
    );

    // Add loyalty points to the user's account
    tourist.Loyalty_Points = tourist.Loyalty_Points + loyaltyPoints;
    tourist.Total_Loyalty_Points = tourist.Total_Loyalty_Points + loyaltyPoints;

    if (tourist.Total_Loyalty_Points >= 500000) {
      tourist.Loyalty_Level = 3;
    } else if (tourist.Total_Loyalty_Points >= 100000) {
      tourist.Loyalty_Level = 2;
    } else {
      tourist.Loyalty_Level = 1;
    }

    await tourist.save();

    res.status(200).json({ message: "Booking successful!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving booking", error });
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
