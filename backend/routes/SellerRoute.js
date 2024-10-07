// #Task route solution
const express = require('express');
const router = express.Router();
const SellerModel = require('../models/Seller.js');
const { default: mongoose } = require('mongoose');
const {createSeller,readSeller,updateSeller, getSeller,deleteSeller,deleteAllSellers} = require('../controllers/SellerController.js');


  

router.post("/createSeller",createSeller)
router.get("/readSeller/:id", readSeller)
router.put("/updateSeller/:id",updateSeller)
router.get("/get",getSeller)
router.delete("/delete/:id", deleteSeller)
router.delete("/deleteall",deleteAllSellers)

module.exports = router;

