const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

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

app.use("/home/tourist", require("./routes/touristRoutes"));
app.use("/home/other", require("./routes/otherRoutes"));
