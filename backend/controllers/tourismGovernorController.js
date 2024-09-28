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
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}

module.exports={
    createTourismGovernor
};