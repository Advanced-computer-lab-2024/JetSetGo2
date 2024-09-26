const express = require('express');
const router = express.Router();
const Activity = require('../models/ActivityCRUD');

// CRUD operations
const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
   const { id } = req.body; // Extract id from the request body
   const updateData = {}; // Initialize an empty object for updates

   // Only add fields to updateData if they exist in the request body
   if (req.body.date) updateData.date = req.body.date;
   if (req.body.time) updateData.time = req.body.time;
   if (req.body.location) updateData.location = req.body.location;
   if (req.body.price) updateData.price = req.body.price;
   if (req.body.category) updateData.category = req.body.category;
   if (req.body.tags) updateData.tags = req.body.tags;
   if (req.body.specialDiscount) updateData.specialDiscount = req.body.specialDiscount;
   if (req.body.isBookingOpen !== undefined) updateData.isBookingOpen = req.body.isBookingOpen; // Check for undefined

   try {
      const updatedActivity = await Activity.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedActivity) {
         return res.status(404).json({ error: "Activity not found" });
      }
      res.status(200).json(updatedActivity);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

const deleteActivity = async (req, res) => {
  const { id } = req.body;
  try {
    const deletedActivity = await Activity.findByIdAndDelete(id);
    if (!deletedActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Define routes
router.post("/add", createActivity);
router.get("/get", getActivity);
router.put("/update", updateActivity);
router.delete("/delete", deleteActivity);

module.exports = router;
