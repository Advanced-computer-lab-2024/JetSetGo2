const express = require("express");
const router = express.Router();
const {
  createTransportation,
  getAllTransportations,
  updateTransportation,
  deleteTransportation,
  deleteAllTransportations,
  readAdvertiserTransportations,
  getUpcomingTransportations,
} = require("../controllers/TransportationCRUDcontroller");

// Define routes
router.post("/add", createTransportation);
router.get("/get", getAllTransportations);
router.put("/update/:id", updateTransportation);
router.delete("/delete/:id", deleteTransportation);
router.delete("/deleteAll", deleteAllTransportations);
router.get("/getAdverTrans", readAdvertiserTransportations);
router.get("/upcoming", getUpcomingTransportations);

module.exports = router;
