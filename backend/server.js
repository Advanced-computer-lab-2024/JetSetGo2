// External variables
require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Importing route controllers
const activityRoutes = require("./routes/ActivityCRUDcontroller");
const historicalPlaceRoutes = require("./routes/HistoricalPlaceCRUDcontroller");
const museumRoutes = require("./routes/MuseumCRUDcontroller");

const MongoURI = process.env.MONG_URI;

// App variables
const app = express();
const port = process.env.PORT || "8000";

// Mongo DB connection
mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

// Base Route
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

// Routes
app.use('/activity', activityRoutes);
app.use('/historicalPlace', historicalPlaceRoutes);
app.use('/museum', museumRoutes);
