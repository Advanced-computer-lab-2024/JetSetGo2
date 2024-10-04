const express = require('express');
const router = express.Router();
const Tour = require('../models/TGuide.js');
const TourModel = require('../models/TGuide.js');

const createUser = async (req, res) => {
   //add a new user to the database with 
   //Name, Email and Age
   const { Name, Email, Age, LanguagesSpoken, MobileNumber, YearsOfExperience, PreviousWork } = req.body;
   try {
      const user = await TourModel.create({ Name, Email, Age, LanguagesSpoken, MobileNumber, YearsOfExperience, PreviousWork });
      res.status(200).json(user);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
}



// Method to get all tour guides or a specific one by ID
const getuser = async (req, res) => {
   const { id } = req.params;  // Extract the tour guide ID from the URL if provided

   try {
      let tourGuide;

      if (id) {
         // If an ID is provided, find that specific tour guide
         tourGuide = await Tour.findById(id);

         if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
         }
      } else {
         // If no ID is provided, find all tour guides
         tourGuide = await Tour.find();  // Retrieve all tour guides
      }

      res.status(200).json(tourGuide);  // Send back the data
   } catch (error) {
      res.status(400).json({ error: error.message });  // Handle any errors
   }
};
const getUserById = async (req, res) => {
   const { id } = req.params;
   try {
      const tourist = await TourModel.findById(id);
      res.status(200).json(tourist);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

const updateUser = async (req, res) => {
   const { id } = req.params; // Extract id from the request body
   const updateData = {}; // Initialize an empty object for updates

   // Only add fields to updateData if they exist in the request body
   if (req.body.Name) updateData.Name = req.body.Name;
   if (req.body.MobileNumber) updateData.MobileNumber = req.body.MobileNumber;
   if (req.body.Age) updateData.Age = req.body.Age;
   if (req.body.PreviousWork) updateData.PreviousWork = req.body.PreviousWork;
   if (req.body.YearsOfExperience) updateData.YearsOfExperience = req.body.YearsOfExperience;
   if (req.body.LanguagesSpoken) updateData.LanguagesSpoken = req.body.LanguagesSpoken;
   if (req.body.Email) updateData.Email = req.body.Email;

   try {
      const updatedActivity = await TourModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedActivity) {
         return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(updatedActivity);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

const deleteTGuide = async (req, res) => {
   console.log('Request to delete tourism guide:', req.params.id);  // Log the ID
   try {
      const { id } = req.params;
      const deletedTGuide = await TourModel.findByIdAndDelete(id);

      if (!deletedTGuide) {
         return res.status(404).json({
            message: "User not found",
         });
      }

      res.status(200).json({
         message: "User deleted successfully",
         user: deletedTGuide,
      });
   } catch (error) {
      console.error('Error deleting tourism governor:', error);
      res.status(500).json({
         message: "Error deleting user",
         error,
      });
   }
};
module.exports = { getuser, updateUser, createUser, getUserById, deleteTGuide };
