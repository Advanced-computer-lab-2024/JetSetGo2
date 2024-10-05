const TourModel = require('../models/TGuide.js');
const { default: mongoose } = require('mongoose');
const express = require('express');
const router = express.Router();
const {getuser,updateUser,createUser,getUserById} = require('../controllers/TGuideController');


router.post("/add",createUser);
router.get("/get",getuser);
router.put("/update/:id",updateUser)
router.get("/users/:id",getUserById)


module.exports = router;

 