const express = require('express');
const router = express.Router();
const {createActivity,getActivity,updateActivity,deleteActivity, deleteAllActivities, upcomingactivity} = require('../controllers/ActivityCRUDcontroller');

// Define routes
router.post("/add", createActivity);
router.get("/get", getActivity);
router.put("/update/:id", updateActivity);
router.delete("/delete/:id", deleteActivity);
router.delete('/deleteAll', deleteAllActivities);
router.get("/upcomingactivity", upcomingactivity);

module.exports = router;
