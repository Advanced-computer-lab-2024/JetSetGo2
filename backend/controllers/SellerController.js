const express = require('express');
const SellerModel = require('../models/Seller.js');

const createSeller = async(req,res) => {
    //add a new user to the database with 
    //Name, Email and Age
    const{ UserName, Password, Email, Description} = req.body;
    try{
       const Seller = await SellerModel.create({UserName, Password, Email, Description});
       res.status(200).json(Seller)
    }catch(error){
       res.status(400).json({error:error.message})
    }
 }
 
 const readSeller = async (req, res) => {
     const { UserName } = req.body; // Get the 'id' from the request parameters
   
     try {
       // Find the seller by their unique 'id'
       const seller = await SellerModel.findOne({UserName});
   
       // Check if seller exists
       if (!seller) {
         return res.status(404).json({ error: "Seller not found" });
       }
   
       // If seller is found, return the seller's information
       res.status(200).json(seller);
     } catch (error) {
       res.status(400).json({ error: error.message });
     }
   };
   
 
 
   const updateSeller = async (req, res) => {
     const { UserName, Password, Email, Description } = req.body;
   
     try {
       // Construct an object containing only the fields that are provided
       const updateFields = {};
   
       if (Password) updateFields.Password = Password;
       if (Email) updateFields.Email = Email;
       if (Description) updateFields.Description = Description;
   
       // Update the seller with only the provided fields
       const Seller = await SellerModel.findOneAndUpdate(
         { UserName: UserName },
         { $set: updateFields },  // Use $set to update only the provided fields
         { new: true }  // Return the updated document
       );
   
       if (!Seller) {
         return res.status(404).json({ error: "Seller not found" });
       }
   
       res.status(200).json(Seller);
     } catch (error) {
       res.status(400).json({ error: error.message });
     }
   };
   
   module.exports={
    createSeller,readSeller,updateSeller
};