const express = require('express');
const router = express.Router();
const {createActivity,bookactivity,getActivity,updateActivity,deleteActivity, deleteAllActivities, readAdverActivites , getActivityById} = require('../controllers/ActivityCRUDcontroller');

// Define routes
router.post("/add", createActivity);
router.get("/get", getActivity);
router.get("/getID/:id", getActivityById);
router.put("/update/:id", updateActivity);
router.delete("/delete/:id", deleteActivity);
router.delete('/deleteAll', deleteAllActivities);
router.get('/getAdverAct', readAdverActivites);
router.patch("/book/:id", bookactivity); 


module.exports = router;
