const express = require("express");
const router = express.Router();
const {createActivity,getBookedactivities,bookactivity,submitReview,getActivity,updateActivity,deleteActivity, deleteAllActivities, readAdverActivites,cancelactivity , getActivityById, flagActivity} = require('../controllers/ActivityCRUDcontroller');

// Define routes
router.post("/add", createActivity);
router.get("/get", getActivity);
router.get("/getID/:id", getActivityById);
router.put("/update/:id", updateActivity);
router.delete("/delete/:id", deleteActivity);
router.delete("/deleteAll", deleteAllActivities);
router.get("/getAdverAct", readAdverActivites);
router.patch("/book/:id", bookactivity); // PATCH request to book a tour
router.patch("/flag/:id", flagActivity);
router.post("/cancelBooking/:id", cancelactivity);
router.get('/getBookedactivities', getBookedactivities);
router.post('/submitReview/:activityId',submitReview);


module.exports = router;
