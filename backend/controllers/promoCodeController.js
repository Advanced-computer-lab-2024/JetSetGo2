const PromoCode = require("../models/PromoCode");

// Create a new promo code
const createPromoCode = async (req, res) => {
  const { code, discountType, discountValue, startDate, expiryDate, isActive } =
    req.body;

  try {
    const newPromoCode = new PromoCode({
      code,
      discountType,
      discountValue,
      startDate,
      expiryDate,
      isActive,
    });

    await newPromoCode.save();
    res.status(201).json({
      message: "Promo code created successfully",
      promoCode: newPromoCode,
    });
  } catch (error) {
    console.error("Error creating promo code:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create promo code", error: error.message });
  }
};

// Get all promo codes
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.json(promoCodes);
  } catch (error) {
    console.error("Error fetching promo codes:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch promo codes", error: error.message });
  }
};

// Redeem a promo code
const redeemPromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    const now = new Date();
    if (now < promoCode.startDate || now > promoCode.expiryDate) {
      return res
        .status(400)
        .json({ message: "Promo code is not active or expired" });
    }

    if (!promoCode.isActive) {
      return res.status(400).json({ message: "Promo code is inactive" });
    }

    res.json({
      message: "Promo code redeemed successfully",
      discount: promoCode.discountValue,
    });
  } catch (error) {
    console.error("Error redeeming promo code:", error.message);
    res
      .status(500)
      .json({ message: "Failed to redeem promo code", error: error.message });
  }
};

module.exports = {
  createPromoCode,
  getAllPromoCodes,
  redeemPromoCode,
};
