const express = require("express");
const router = express.Router();
const {
  createTourist,
  updateTourist,
  getTourist,
  getTouristById,
  deleteTourist,
  deleteAllTourist,
  bookTransportation,
  getBookedTransportations,
  getTouristNationality,
  buyProduct,
  getPurchasedProducts,
  addRating,
  addReview,
  redeemPointsToCash,
  reqAccountToBeDeleted,
  addToCart,
  getCart,
  removeFromCart,
  addPereferenceTags,
  getTouristPreferences
} = require("../controllers/touristController");
router.post("/cart/add/:touristId/:productId", addToCart);
router.get("/cart/:touristId", getCart);
router.delete("/cart/remove/:touristId/:productId", removeFromCart);


router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.post("/addTourist", createTourist);
router.post(
  "/bookTransportation/:touristId/:transportationId",
  bookTransportation
);
router.post("/buyProduct/:touristId/:productId", buyProduct);
router.post("/rateProduct/:productId", addRating);
router.post("/reviewProduct/:productId", addReview);
router.put("/updateTourist/:id", updateTourist);
router.get("/getTourist", getTourist);
router.get("/get", getTourist);
router.get("/get", getTourist);
router.get("/getTourist/:id", getTouristById);
router.get("/getBookedTransportations/:touristId", getBookedTransportations);
router.get("/getPurchasedProducts/:touristId", getPurchasedProducts);
router.get("/getNat/:touristId",getTouristNationality);
router.delete("/delete/:id", deleteTourist);
router.delete("/deleteAllTourist", deleteAllTourist);
router.put("/redeempoints/:id", redeemPointsToCash);
router.delete("/deletMyAccount/:id", reqAccountToBeDeleted);
router.post("/addPreferenceTags/:id", addPereferenceTags);
router.get("/preferences/:id", getTouristPreferences);


module.exports = router;