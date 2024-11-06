const TourModel = require('../models/TGuide.js');
const { default: mongoose } = require('mongoose');
const express = require('express');
const router = express.Router();
const {getuser,updateUser,createUser,getUserById,deleteTGuide,submitReview} = require('../controllers/TGuideController');

router.post('/submitReview/:tourGuideId',submitReview);

router.post("/add",createUser);
router.get("/get",getuser);
router.put("/update/:id",updateUser)
router.get("/users/:id",getUserById)
router.delete("/delete/:id", deleteTGuide);


module.exports = router;

 