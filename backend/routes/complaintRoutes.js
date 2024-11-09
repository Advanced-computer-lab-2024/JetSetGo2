// #Task route solution
const express = require('express');
const router = express.Router();
const {createComplaint, deleteComplaint, getComplaints,resolveComplaint,replyToComplaint,getComplaintsByTourist} = require('../controllers/complaintController');

// Define routes
router.post("/add", createComplaint);
router.delete("/delete/:id", deleteComplaint);
router.get("/get",getComplaints );
router.put("/resolve/:id", resolveComplaint); 
router.put("/reply/:id", replyToComplaint);
router.get("/complaints/:touristId", getComplaintsByTourist);


 

module.exports = router;

