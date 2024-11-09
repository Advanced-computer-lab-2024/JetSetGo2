const express = require("express");
const router = express.Router();
const {
  createTourist,
  updateTourist,
  getTourist,
  getTouristById,
  deleteTourist,
  deleteAllTourist,
} = require("../controllers/touristController");

router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.post("/addTourist", createTourist);
router.put("/updateTourist/:id", updateTourist);
router.get("/getTourist", getTourist);
router.get("/get", getTourist);
router.get("/get", getTourist);
router.get("/getTourist/:id", getTouristById);
router.delete("/delete/:id", deleteTourist);
router.delete("/deleteAllTourist", deleteAllTourist);

module.exports = router;
