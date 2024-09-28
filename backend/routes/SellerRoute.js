// #Task route solution
const express = require('express');
const router = express.Router();
const SellerModel = require('../models/Seller.js');
const { default: mongoose } = require('mongoose');
const {createSeller,readSeller,updateSeller} = require('../controllers/SellerController.js');


  

router.post("/createSeller",createSeller)
router.get("/readSeller", readSeller)
router.put("/updateSeller",updateSeller)
module.exports = router;

