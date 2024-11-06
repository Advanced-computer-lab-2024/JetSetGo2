const express = require("express");
const {
  createGuide,
  readGuide,
  readGuideID,
  updateGuide,
  deleteGuide,
  bookTour,
} = require("../controllers/schematourController");

const router = express.Router();

router.post("/createtour", createGuide);
router.get("/readTour", readGuide);
router.get("/readTourId", readGuideID);
router.put("/updateTourId/:id", updateGuide);
router.delete("/deleteTour/:id", deleteGuide);
router.patch("/book/:id", bookTour); // PATCH request to book a tour

module.exports = router;
