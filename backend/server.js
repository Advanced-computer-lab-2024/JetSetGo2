const express = require("express");

const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
