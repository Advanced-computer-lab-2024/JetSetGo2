const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadadverlogo"); // Import the multer configuration

const {
  createAdver,
  getAdver,
  updateAdver,
  getAdverById,
  getAdvertiser,
  deleteAdver,
} = require("../controllers/AdverCONT");

router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.post("/createadver", createAdver);
router.get("/getadver/:id", getAdver);
router.put("/updateadver/:id", upload.single("logoFile"), updateAdver);
router.get("/getTourist/:id", getAdverById);
router.get("/get", getAdvertiser);
router.delete("/delete/:id", deleteAdver);

module.exports = router;
