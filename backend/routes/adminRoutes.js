// #Task route solution
const express = require("express");
const router = express.Router();
const {
  createAdmin,
  deleteAdmin,
  getAdmins,
  updatePassword,
} = require("../controllers/adminControllers");

// Define routes
router.post("/add", createAdmin);
router.delete("/delete/:id", deleteAdmin);
router.get("/get", getAdmins);
router.put("/update-password/:id", updatePassword);

module.exports = router;
