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
const validatePromoCode = async (promoCode) => {
  const currentDate = new Date();

  try {
    // Check if the promo code exists
    const code = await PromoCode.findOne({ code: promoCode });

    if (!code) {
      return { valid: false, message: "Promo code not found." };
    } else {
      console.log("promocode SAVE20");
    }

    // Check if the promo code is active and within the valid date range
    if (
      !code.isActive ||
      code.expiryDate < currentDate ||
      code.startDate > currentDate
    ) {
      return { valid: false, message: "Promo code is expired or inactive." };
    }

    // Return valid response with promo code details
    return {
      valid: true,
      discountType: code.discountType,
      discountValue: code.discountValue,
    };
  } catch (error) {
    console.error("Error validating promo code:", error.message);
    return { valid: false, message: "An error occurred during validation." };
  }
};

module.exports = {
  createPromoCode,
  getAllPromoCodes,
  validatePromoCode,
};
