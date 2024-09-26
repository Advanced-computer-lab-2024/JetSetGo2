
// External variables
require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const {createActivity,getActivity, updateActivity, deleteActivity} = require("./routes/ActivityCRUDcontroller");
const MongoURI = process.env.MONG_URI ;


//App variables
const app = express();
const port = process.env.PORT || "8000";
const user = require('./models/ActivityCRUD');
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

app.use(express.json())
app.post("/addActivity",createActivity);
app.get("/getActivity", getActivity);
app.put("/updateActivity", updateActivity);
app.delete("/deleteActivity", deleteActivity);


/*
                                                    End of your code
*/

