const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
mongoose.set("strictQuery", false);
require("dotenv").config();

const MongoURI = process.env.MONGO_URI;

// schemas used in search method
const TourGouvnerTagSearch = require("./models/tourismGovernerTags.js");
const Museum = require("./models/MuseumCRUD.js");
const HistoricalPlace = require("./models/HistoricalPlaceCRUD.js");
const Activity = require("./models/ActivityCRUD.js");
const Category = require("./models/CategoryCRUD.js");
const Itinerary = require("./models/schematour.js");
const PreferenceTagSearch = require("./models/preferanceTagsCRUD.js");

// routes
const activityRoutes = require("./routes/ActivityCRUDroute");
const historicalPlaceRoutes = require("./routes/HistoricalPlaceCRUDroute");
const museumRoutes = require("./routes/MuseumCRUDroute");
const itineraryRoutes = require("./routes/SchemaTourRoutes");
const tourist = require("./routes/touristRoutes");
const other = require("./routes/otherRoutes");
const preferanceTags = require("./routes/preferanceTagsRoutes");
const TourGuideRoute = require("./routes/TGuideRoutes.js");
const categoryRoutes = require("./routes/CategoryCRUDroute");
const productRoutes = require("./routes/ProductCRUDroute");
const user = require("./routes/tourismGovernerTags");
const seller = require("./routes/SellerRoute");
const tourismGovernorRoutes = require("./routes/tourismGovernorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const AdvertiserRoutes = require("./routes/AdverRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || "8000";

mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use("/activity", activityRoutes);
app.use("/historicalPlace", historicalPlaceRoutes);
app.use("/museum", museumRoutes);
app.use("/category", categoryRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/product", productRoutes);
app.use("/home/tourist", tourist);
app.use("/home/other", other);
app.use("/prefTags", preferanceTags);
app.use("/TourGuide", TourGuideRoute);
app.use("/home/adver", require("./routes/AdverRoutes.js"));
app.use("/TourismTags", user);
app.use("/Seller", seller);
app.use("/tourism", tourismGovernorRoutes);
app.use("/admin", adminRoutes);
app.use("/Advertiser", AdvertiserRoutes);
app.use("/Tourist", tourist);

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
      // Search by name for museums or historical places or itinaries
      // Search for tourism governor tags by name
      const tourismTags = await TourGouvnerTagSearch.find({ name: regex });
      const tagIds = tourismTags.map((tag) => tag._id);

      // Find museums that reference these tags
      searchResults.Museums = await Museum.find({
        tourismGovernerTags: { $in: tagIds },
      }).populate("tourismGovernerTags");

      // Find historical places that reference these tags
      searchResults.HistoricalPlace = await HistoricalPlace.find({
        tourismGovernerTags: { $in: tagIds },
      }).populate("tourismGovernerTags");

      searchResults.itinaries = await Itinerary.find({ name: regex });
    } else if (searchType === "category") {
      // Search activities by category name
      const categories = await Category.find({ name: regex });
      const categoryIds = categories.map((category) => category._id);
      searchResults.activities = await Activity.find({
        category: { $in: categoryIds }, // Only find activities with matching categories
      }).populate("category"); // Then populate the category field
    } else if (searchType === "tags") {
      // search for Museum/Historical or Activities or itineraries by tags
      // Search for tourism governor tags by name
      const tourismTags = await TourGouvnerTagSearch.find({ type: regex });
      const tagIds = tourismTags.map((tag) => tag._id);

      // Find museums that reference these tags
      searchResults.Museums = await Museum.find({
        tourismGovernerTags: { $in: tagIds },
      }).populate("tourismGovernerTags");

      // Find historical places that reference these tags
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
