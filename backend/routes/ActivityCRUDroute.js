const express = require("express");
const router = express.Router();
const {createActivity,finalizeActivityBooking,getBookedactivities,bookactivity,submitReview,getActivity,updateActivity,deleteActivity, deleteAllActivities, readAdverActivites,cancelactivity , getActivityById, flagActivity, getTouristReport} = require('../controllers/ActivityCRUDcontroller');

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
router.post("/finalizeBooking/:id", finalizeActivityBooking); // Finalize booking after payment
router.get("/report/:advertiserId", getTouristReport);

module.exports = router;
