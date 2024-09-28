// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const Sellerroute = require("./routes/SellerRoute");
const MongoURI ='mongodb+srv://marwanallam8:012345678910@cluster0.ew4lb.mongodb.net/'  ;


//App variables
const app = express();
const port = process.env.PORT || "8080";
app.use(express.json());
const Seller = require('./models/Seller');
// #Importing the userController


// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
/*
                                                    Start of your code
*/
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });

// #Routing to userController here

app.use('/Seller',Sellerroute);

/*
                                                    End of your code
*/

