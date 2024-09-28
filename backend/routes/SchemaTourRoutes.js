const express = require('express');
const { createGuide, readGuide, readGuideID, updateGuide, deleteGuide } = require('../controllers/schematourController');

const router = express.Router();

router.post("/createtour", createGuide);
router.get("/readTour", readGuide);
router.get("/readTourId", readGuideID); 
router.put("/updateTourId", updateGuide);
router.delete("/deleteTour", deleteGuide);

module.exports = router;
