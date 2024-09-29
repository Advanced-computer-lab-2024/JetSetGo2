// External variables
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Importing route controllers
const tourismGovernorRoutes = require("./routes/tourismGovernorRoutes");
const adminRoutes = require("./routes/adminRoutes");

const MongoURI = process.env.MONG_URI;

// App variables
const app = express();
app.use(cors());
const port = process.env.PORT || "8000";

// MongoDB connection
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
app.use('/tourism', tourismGovernorRoutes);
app.use('/admin', adminRoutes);
