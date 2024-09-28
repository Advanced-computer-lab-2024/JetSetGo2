const express = require("express");
const router = express.Router();

const { createOther, getOther } = require("../controllers/otherController");

router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.post("/addOther", createOther);
router.get("/getOther", getOther);

module.exports = router;
