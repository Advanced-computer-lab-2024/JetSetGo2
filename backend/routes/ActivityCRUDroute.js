const express = require('express');
const router = express.Router();
const {createActivity,bookactivity,getActivity,updateActivity,deleteActivity, deleteAllActivities, readAdverActivites,cancelactivity} = require('../controllers/ActivityCRUDcontroller');

// Define routes
router.post("/add", createActivity);
router.get("/get", getActivity);
router.put("/update/:id", updateActivity);
router.delete("/delete/:id", deleteActivity);
router.delete('/deleteAll', deleteAllActivities);
router.get('/getAdverAct', readAdverActivites);
router.patch("/book/:id", bookactivity); // PATCH request to book a tour
router.post("/cancelBooking/:id", cancelactivity);


module.exports = router;
