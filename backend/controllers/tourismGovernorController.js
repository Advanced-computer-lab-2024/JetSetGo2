const express = require('express');
const tourismGovernorModel = require('../models/tourismGovernor.js');

const createTourismGovernor = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate the input fields
        if (!username || !password) {
            return res.status(400).json({ 
                message: "Username and password are required." 
            });
        }

        // Create the new user
        const newTourismGovernor = new tourismGovernorModel({
            username,
            password
        });

        // Save the user to the database
        const savedTourismGovernor = await newTourismGovernor.save();

        res.status(201).json({
            message: "User created successfully",
            user: savedTourismGovernor
        });
    } catch (error) {
        // Handling duplicate key error (e.g., duplicate username)
        if (error.code === 11000) {  // 11000 is the MongoDB error code for duplicate keys
            return res.status(400).json({ message: "Username already exists." });
        }
        
        console.error('Error:', error);  // Log other errors
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

const getTourismGovernor = async (req, res) => {
    try {
        // Use the correct model to find all admins
        const tourismGovernor = await tourismGovernorModel.find();
        res.status(200).json(tourismGovernor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports={
    createTourismGovernor,getTourismGovernor
};