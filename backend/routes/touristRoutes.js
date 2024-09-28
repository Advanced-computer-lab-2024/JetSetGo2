const express = require("express");
const router = express.Router();
const {
  createTourist,
  updateTourist,
  getTourist,
} = require("../controllers/touristController");

router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.post("/addTourist", createTourist);
router.put("/updateTourist", updateTourist);
router.get("/getTourist", getTourist);

module.exports = router;
