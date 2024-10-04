const adverModel = require('../models/AdverMODEL.js');
const {default: mongoose} = require("mongoose");


const createAdver = async(req,res) => {
    const{Name , Link, Hotline , Mail , Profile , Loc , CompanyDes , Services} = req.body ;
    try{
       const adver = await adverModel.create({Name , Link, Hotline , Mail , Profile , Loc , CompanyDes , Services});
       res.status(200).json(adver)
    }catch(error){
       res.status(400).json({error:error.messege})
    }
 }       

 const getAdver = async (req, res) => {
   const { id } = req.params;
  try {
    const adver = await adverModel.findById(id);
    res.status(200).json(adver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  };
}

  const getAdvertiser = async (req, res) => {
   try {
     
     const adver = await adverModel.find();
     res.status(200).json(adver);
   } catch (error) {
     res.status(400).json({ error: error.message });
   }
 };




   //  try{
   //     const adver = await adverModel.find({});
   //     res.status(200).json(adver)
   //  }catch(error){
   //     res.status(400).json({error:error.messege})
   //  }
   




   const getAdverById = async (req, res) => {
   const{id} = req.params ; 
      try{
         const adver = await adverModel.findByI(id);
         res.status(200).json(adver)
      }catch(error){
         res.status(400).json({error:error.messege})
      }
     }

   const updateAdver = async (req, res) => {
      const { id } = req.params; // Extract id from the request body
      const UpdateAdver = {}; 

      if (req.body.Name) UpdateAdver.Name = req.body.Name;
      if (req.body.Link) UpdateAdver.Link = req.body.Link;
      if (req.body.Hotline) UpdateAdver.Hotline = req.body.Hotline;
      if (req.body.Mail) UpdateAdver.Mail = req.body.Mail;
      if (req.body.Profile) UpdateAdver.Profile = req.body.Profile;
      if (req.body.Loc) UpdateAdver.Loc = req.body.Loc;
      if (req.body.CompanyDes) UpdateAdver.CompanyDes = req.body.CompanyDes;
      if (req.body.Services) UpdateAdver.Services = req.body.Services;
      try {
         const updateAdver = await adverModel.findByIdAndUpdate(id, UpdateAdver, { new: true });
         if (!updateAdver) {
            return res.status(404).json({ error: "Advertiser not found" });
         }
         res.status(200).json(updateAdver);
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   };

  


// Export the router
module.exports = {createAdver, getAdver, updateAdver , getAdverById, getAdvertiser};