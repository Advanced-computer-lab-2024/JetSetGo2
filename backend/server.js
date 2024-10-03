// Import necessary packages
require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const TourGuideRoute = require("./routes/TGuideRoutes.js");

// Initialize Express app
const app = express();
const port = process.env.PORT || "8004";

// Set up CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only requests from this origin
  credentials: true, // Allow credentials if needed
};
 
// Middleware
app.use(cors(corsOptions));// Enable CORS with options
app.use(express.json()); // Parse JSON bodies

// MongoDB connection
const MongoURI = 'mongodb+srv://marwanallam8:012345678910@cluster0.ew4lb.mongodb.net/';
mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Start server after successful connection
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch(err => console.log(err));

// API routes
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

// Use TourGuide routes
app.use('/TourGuide', TourGuideRoute);
