const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

const MongoURI = process.env.MONGO_URI;

const TourGouvnerTagSearch = require("./models/tourismGovernerTags.js");
const Museum = require("./models/MuseumCRUD.js");
const HistoricalPlace = require("./models/HistoricalPlaceCRUD.js");
const Activity = require("./models/ActivityCRUD.js");
const Itinerary = require("./models/schematour.js");

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
const tourismGovernerTag = require("./models/tourismGovernerTags.js");

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
      MuseumsOrHistoricalPlace: [],
      activities: [],
    };

    // Check searchType and perform the appropriate query
    if (searchType === "name") {
      // Search by name for museums or historical places
      searchResults.MuseumsOrHistoricalPlace = await TourGouvnerTagSearch.find({
        name: regex,
      });
    } else if (searchType === "category") {
      // Search activities by category
      searchResults.activities = await Activity.find().populate({
        path: "category",
        match: { name: regex }, // Search category name
      });
    } else if (searchType === "tags") {
      // search for itanries by tags
    } else {
      return res.status(400).json({ message: "Invalid Search Type." });
    }

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
