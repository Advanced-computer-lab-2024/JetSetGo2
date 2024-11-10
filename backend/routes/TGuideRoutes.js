const TourModel = require("../models/TGuide.js");
const { default: mongoose } = require("mongoose");
const upload = require("../middleware/uploadtourguidephoto.js");
const express = require("express");
const router = express.Router();
const {getuser,updateUser,getUserById,deleteTGuide,submitReview ,acceptTourguide,  reqAccountToBeDeleted,
} = require('../controllers/TGuideController');

router.post('/submitReview/:tourGuideId',submitReview);
router.get("/get", getuser);
router.put("/update/:id", upload.single("Photo"), updateUser);
router.get("/users/:id", getUserById);
router.delete("/delete/:id", deleteTGuide);
router.put("/acceptTourguide/:id", acceptTourguide);
router.delete("/deletMyAccount/:id", reqAccountToBeDeleted);

module.exports = router;
