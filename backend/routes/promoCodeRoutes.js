const express = require("express");
const {
  createPromoCode,
  getAllPromoCodes,
  redeemPromoCode,
} = require("../controllers/promoCodeController");

const router = express.Router();

// Create a promo code
router.post("/create", createPromoCode);

// Get all promo codes
router.get("/get", getAllPromoCodes);

// Redeem a promo code
router.post("/redeem", redeemPromoCode);

module.exports = router;
