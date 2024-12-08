const express = require("express");
const {
  createPromoCode,
  getAllPromoCodes,
  validatePromoCode,
} = require("../controllers/promoCodeController");

const router = express.Router();

// Create a promo code
router.post("/create", createPromoCode);

// Get all promo codes
router.get("/get", getAllPromoCodes);

// Redeem a promo code
router.post("/redeem", validatePromoCode);

module.exports = router;
