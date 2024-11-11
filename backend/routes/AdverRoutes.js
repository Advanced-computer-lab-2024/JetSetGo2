const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadadverlogo"); // Import the multer configuration

const {
  getAdver,
  updateAdver,
  getAdverById,
  getAdvertiser,
  deleteAdver,
  acceptAdver,
  rejectAdver,
  reqAccountToBeDeleted,
} = require("../controllers/AdverCONT");

router.get("/", (req, res) => {
  res.status(200).send("You have everything installed!");
});

router.get("/getadver/:id", getAdver);
router.put("/updateadver/:id", upload.single("logoFile"), updateAdver);
router.get("/getTourist/:id", getAdverById);
router.get("/get", getAdvertiser);
router.delete("/delete/:id", deleteAdver);
router.put("/acceptAdver/:id", acceptAdver);
router.put("/rejectAdver/:id", rejectAdver);
router.delete("/deletMyAccount/:id", reqAccountToBeDeleted);

module.exports = router;
