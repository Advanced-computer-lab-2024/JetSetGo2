
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

const activityRoutes = require("./routes/ActivityCRUDroute");
const historicalPlaceRoutes = require("./routes/HistoricalPlaceCRUDroute");
const museumRoutes = require("./routes/MuseumCRUDroute");
const itineraryRoutes = require("./routes/SchemaTourRoutes");
const tourismGovernorRoutes = require("./routes/tourismGovernorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const MongoURI = process.env.MONGO_URI;

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



app.use('/activity', activityRoutes);
app.use('/historicalPlace', historicalPlaceRoutes);
app.use('/museum', museumRoutes);
app.use('/itinerary',itineraryRoutes);
app.use('/tourism', tourismGovernorRoutes);
app.use('/admin', adminRoutes);
