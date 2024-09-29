// External variables
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const TourGuideRoute = require("./routes/TGuideRoutes.js");

// Correct the connection string by removing the 'MONGO_URI =' part
const MongoURI = 'mongodb+srv://marwanallam8:012345678910@cluster0.ew4lb.mongodb.net/';

// App variables
const app = express();
app.use(cors());
const port = process.env.PORT || "8004";
const user = require('./routes/tourismGovernerTags');

// Mongo DB connection
mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch(err => console.log(err));

// API routes
app.get("/home", (req, res) => {
  res.status(200).send("You have everything installed!");
});

// Routing to userController here
app.use(express.json());
// Add ID parameter to updateUser route

/*
  End of your code
*/
app.use('/TourismTags',user);