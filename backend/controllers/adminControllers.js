const express = require('express');
const adminModel = require('../models/admin.js');

const createAdmin = async (req, res) => {
    try {
        console.log("Request body:", req.body);  // Log the incoming request body for debugging

        const { username, password } = req.body;

        // Validation: check if username and password are present
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        const newAdmin = new adminModel({ username, password });
        const savedAdmin = await newAdmin.save();

        res.status(201).json({
            message: "User created successfully",
            user: savedAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by username and delete them
        const deletedAdmin = await adminModel.findByIdAndDelete(id);
 
       if (!deletedAdmin) {
          return res.status(404).json({
             message: "User not found",
          });
       }
 
       // Respond with a success message
       res.status(200).json({
          message: "User deleted successfully",
          user: deletedAdmin,
       });
    } catch (error) {
       res.status(500).json({
          message: "Error deleting user",
          error,
       });
    }
};

const getAdmin = async (req, res) => {
    try {
        // Use the correct model to find all admins
        const admins = await adminModel.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports={
    createAdmin,deleteAdmin,getAdmin
};