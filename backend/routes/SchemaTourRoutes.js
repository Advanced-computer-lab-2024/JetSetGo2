    const express = require('express');
    const { createGuide, readGuide, readGuideID, updateGuide, deleteGuide,bookTour, flagItinerary,toggleActivation,getIteneraries } = require('../controllers/schematourController');

const router = express.Router();

    router.post("/createtour", createGuide);
    router.get("/readTour", readGuide);
    router.get("/readTourId", readGuideID); 
    router.put("/updateTourId/:id", updateGuide);
    router.delete("/deleteTour/:id", deleteGuide);
    router.patch("/book/:id",bookTour); // PATCH request to book a tour
    router.patch("/toggleActivation/:id", toggleActivation); // Toggle activation of a tour by ID
    router.get("/getIteneraries", getIteneraries);

    router.patch("/flag/:id", flagItinerary);
    module.exports = router;