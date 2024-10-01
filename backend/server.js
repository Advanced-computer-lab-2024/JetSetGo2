const express = require("express");
const cors = require ("cors");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();


const MongoURI =  process.env.MONGO_URI ; 


//App variables
const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || "8000";


// #Importing the userController


// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!");
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));
/*
                                                    Start of your code
*/



app.use("/home/adver",require("./routes/AdverRoutes.js"));





/*
                                                    End of your code
*/

