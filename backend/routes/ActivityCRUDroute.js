const express = require('express');
const router = express.Router();
const {createActivity,getActivity,updateActivity,deleteActivity} = require('../controllers/ActivityCRUDcontroller');

// Define routes
router.post("/add", createActivity);
router.get("/get", getActivity);
router.put("/update", updateActivity);
router.delete("/delete", deleteActivity);

module.exports = router;
