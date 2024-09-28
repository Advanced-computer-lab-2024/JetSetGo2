require('dotenv').config();

const express = require("express");
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const {createGuide,readGuide,readGuideID,updateGuide,deleteGuide} = require("./routes/SchemaTourRoutes")
const MongoURI = 'mongodb+srv://marwanallam8:012345678910@cluster0.ew4lb.mongodb.net/' ;



const itineraryRoutes = require("./routes/SchemaTourRoutes");
const app = express();
app.use(cors());
const port = process.env.PORT || "9000";


mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));

app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });

app.use(express.json());
app.use('/itinerary',itineraryRoutes);