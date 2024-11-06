// #Task route solution
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadsellerlogo.js"); // Import the multer configuration
const SellerModel = require("../models/Seller.js");
const { default: mongoose } = require("mongoose");
const {
  readSeller,
  updateSeller,
  getSeller,
  deleteSeller,
  deleteAllSellers,
  acceptSeller,
} = require("../controllers/SellerController.js");

router.get("/readSeller/:id", readSeller);
router.put("/updateSeller/:id", upload.single("logoFile"), updateSeller); // Use the upload middleware for logo upload
router.get("/get", getSeller);
router.delete("/delete/:id", deleteSeller);
router.delete("/deleteall", deleteAllSellers);
router.put("/acceptSeller/:id", acceptSeller);

module.exports = router;
