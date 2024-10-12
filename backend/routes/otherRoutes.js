const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middleware/uploadDocuments"); // Adjust the path based on your structure
const {
  createOther,
  getOther,
  deleteAllOthers,
} = require("../controllers/otherController");

router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.post(
  "/addOther",
  upload.fields([
    { name: "IDDocument", maxCount: 1 },
    { name: "Certificates", maxCount: 1 },
    { name: "TaxationRegistryCard", maxCount: 1 },
  ]),
  createOther
);
router.get("/getOther", getOther);
router.delete("/deleteAllOther", deleteAllOthers);

module.exports = router;
