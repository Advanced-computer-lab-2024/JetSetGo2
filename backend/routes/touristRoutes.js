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
  redeemPointsToCash,
  reqAccountToBeDeleted,
} = require("../controllers/touristController");

router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.post("/addTourist", createTourist);
router.post(
  "/bookTransportation/:touristId/:transportationId",
  bookTransportation
);
router.put("/updateTourist/:id", updateTourist);
router.get("/getTourist", getTourist);
router.get("/get", getTourist);
router.get("/get", getTourist);
router.get("/getTourist/:id", getTouristById);
router.get("/getBookedTransportations/:touristId", getBookedTransportations);
router.get("/getNat/:touristId", getTouristNationality);
router.delete("/delete/:id", deleteTourist);
router.delete("/deleteAllTourist", deleteAllTourist);
router.put("/redeempoints/:id", redeemPointsToCash);
router.delete("/deletMyAccount/:id", reqAccountToBeDeleted);

module.exports = router;
