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
  getBookmarkedActivities,
  getBookmarkedItineraries,
  getBookmarkedHistoricalPlaces,
  getBookmarkedMuseums,
  toggleBookmarkActivity,
  toggleBookmarkItinerary,
  toggleBookmarkHistoricalPlace,
  toggleBookmarkMuseum,
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
  cancelOrder,
  addPereferenceTags,
  getTouristPreferences
} = require("../controllers/touristController");
// routes/touristRoutes.js
router.delete("/:touristId/cancelOrder/:orderId", cancelOrder);
router.post("/add/:touristId/:productId", addToCart);
router.get("/cart/:touristId", getCart);
router.delete("/remove/:touristId/:productId", removeFromCart);
router.put("/updateq", updateCartQuantity);
router.post("/address/:touristId", addDeliveryAddress);
router.get("/geta/:userId", getTouristAddresses);
router.post(
  "/transportation/finalizeBooking/:transportationId",
  finalizeTransportationBooking
);

router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

// Tourist management routes
router.post("/addTourist", createTourist);
router.put("/updateTourist/:id", updateTourist);
router.get("/getTourist", getTourist);
router.get("/getTourist/:id", getTouristById);
router.delete("/delete/:id", deleteTourist);
router.delete("/deleteAllTourist", deleteAllTourist);

// Transportation-related routes
router.post(
  "/bookTransportation/:touristId/:transportationId",
  bookTransportation
);
router.get("/getBookedTransportations/:touristId", getBookedTransportations);

// Products-related routes
router.post("/buyProduct/:touristId/:productId", buyProduct);
router.get("/getPurchasedProducts/:touristId", getPurchasedProducts);
router.post("/buyProducts", buyProducts);

router.post("/rateProduct/:productId", addRating);
router.post("/reviewProduct/:productId", addReview);

// Tourist features routes
router.get("/getNat/:touristId", getTouristNationality);
router.put("/redeempoints/:id", redeemPointsToCash);
router.delete("/deletMyAccount/:id", reqAccountToBeDeleted);

router.get("/bookmarkActivity/:touristId", getBookmarkedActivities);
router.post("/bookmarkActivity/:touristId/:activityId", toggleBookmarkActivity);
router.get("/bookmarkItinerary/:touristId", getBookmarkedItineraries);
router.post(
  "/bookmarkItinerary/:touristId/:itineraryId",
  toggleBookmarkItinerary
);
router.post(
  "/bookmarkHistoricalPlace/:touristId/:historicalPlaceId",
  toggleBookmarkHistoricalPlace
);
router.get(
  "/bookmarkedHistoricalPlaces/:touristId",
  getBookmarkedHistoricalPlaces
);
router.get("/bookmarkMuseum/:touristId", getBookmarkedMuseums); // Get all bookmarked museums
router.post("/bookmarkMuseum/:touristId/:museumId", toggleBookmarkMuseum);

// Wishlist routes
router.post("/:userId/wishlist/add", addToWishlist);
router.get("/:userId/wishlist", getWishlist);
router.post("/:userId/wishlist/remove", removeFromWishlist);
router.post("/addPreferenceTags/:id", addPereferenceTags);
router.get("/preferences/:id", getTouristPreferences);


module.exports = router;
