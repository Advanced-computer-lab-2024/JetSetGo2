const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middleware/uploadDocuments"); // Adjust the path based on your structure
const {
  createOther,
  getOther,
  deleteAllOthers,
} = require("../controllers/otherController");

// Health check endpoint
router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

// User creation endpoint with file uploads
router.post(
  "/addOther",
  upload.fields([
    { name: "IDDocument", maxCount: 1 },
    { name: "Certificates", maxCount: 1 },
    { name: "TaxationRegistryCard", maxCount: 1 },
  ]),
  createOther
);

// Get all users
router.get("/getOther", getOther);

// Delete all users
router.delete("/deleteAllOther", deleteAllOthers);

module.exports = router;
