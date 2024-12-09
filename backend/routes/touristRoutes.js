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
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  addDeliveryAddress,
  getTouristAddresses,
  buyProducts,
  finalizeTransportationBooking,
  addPereferenceTags,
  getTouristPreferences
} = require("../controllers/touristController");
router.post("/add/:touristId/:productId", addToCart);
router.get("/cart/:touristId", getCart);
router.delete("/remove/:touristId/:productId", removeFromCart);
router.put("/updateq", updateCartQuantity);
router.post("/address/:touristId", addDeliveryAddress);
router.get("/geta/:userId", getTouristAddresses);
router.post("/transportation/finalizeBooking/:transportationId", finalizeTransportationBooking);





router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.post("/addTourist", createTourist);
router.post(
  "/bookTransportation/:touristId/:transportationId",
  bookTransportation
);
router.post("/buyProduct/:touristId/:productId", buyProduct);
router.post("/buyProducts", buyProducts);

router.post("/rateProduct/:productId", addRating);
router.post("/reviewProduct/:productId", addReview);
router.put("/updateTourist/:id", updateTourist);
router.get("/getTourist", getTourist);
router.get("/get", getTourist);
router.get("/get", getTourist);
router.get("/getTourist/:id", getTouristById);
router.get("/getBookedTransportations/:touristId", getBookedTransportations);
router.get("/getPurchasedProducts/:touristId", getPurchasedProducts);
router.get("/getNat/:touristId", getTouristNationality);
router.delete("/delete/:id", deleteTourist);
router.delete("/deleteAllTourist", deleteAllTourist);
router.put("/redeempoints/:id", redeemPointsToCash);
router.delete("/deletMyAccount/:id", reqAccountToBeDeleted);
// Wishlist routes
router.post("/:userId/wishlist/add", addToWishlist);
router.get("/:userId/wishlist", getWishlist);
router.post("/:userId/wishlist/remove", removeFromWishlist);
router.post("/addPreferenceTags/:id", addPereferenceTags);
router.get("/preferences/:id", getTouristPreferences);


module.exports = router;
