// #Task route solution
const express = require('express');
const router = express.Router();
const {createComplaint, deleteComplaint, getComplaints} = require('../controllers/complaintController');

// Define routes
router.post("/add", createComplaint);
router.delete("/delete/:id", deleteComplaint);
router.get("/get",getComplaints );

module.exports = router;

