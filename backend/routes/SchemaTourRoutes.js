    const express = require('express');
    const { createGuide, readGuide, readGuideID,getBookedItineraries,submitReview,cancelBooking, updateGuide, deleteGuide,bookTour, flagItinerary,toggleActivation,getIteneraries,getItineraryById} = require('../controllers/schematourController');

const router = express.Router();
    router.post('/submitReview/:itineraryId',submitReview);

    router.post("/createtour", createGuide);
    router.get("/readTour", readGuide);
    router.get("/readTourId", readGuideID); 
    router.put("/updateTourId/:id", updateGuide);
    router.delete("/deleteTour/:id", deleteGuide);
    router.patch("/book/:id",bookTour); // PATCH request to book a tour
    router.get("/getIten/:id",getItineraryById);
    router.patch("/toggleActivation/:id", toggleActivation); // Toggle activation of a tour by ID
    router.get("/getIteneraries", getIteneraries);
    router.post("/cancelBooking/:id", cancelBooking);
    router.get('/getBookedItineraries', getBookedItineraries);


    router.patch("/flag/:id", flagItinerary);
    module.exports = router;