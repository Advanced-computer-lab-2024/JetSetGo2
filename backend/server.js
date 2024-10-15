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
const Other = require("./models/Other");
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
const login = require("./routes/auth.js");

const app = express();
app.use(express.json());
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

// Login endpoint for both Tourist and Other users
app.post("/api/auth/login", async (req, res) => {
  const { Email, Password, AccountType } = req.body;

  try {
    let user;

    // Determine the user model to use based on AccountType
    if (AccountType === "Tourist") {
      user = await Tourist.findOne({ Email });
    } else {
      user = await Other.findOne({ Email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // token expires in 1 hour
    });

    // Send response
    res.status(200).json({ message: "Login successful!", token, userType: user.AccountType });
  } catch (error) {
    console.error("Login error:", error); // Log the error
    res.status(500).json({ message: "Server error", error: error.message }); // Send error message in response
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
app.use("/login", login);

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Search endpoint
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
