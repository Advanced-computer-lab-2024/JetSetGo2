// #Task route solution
const express = require("express");
const router = express.Router();
const {
  createAdmin,
  deleteAdmin,
  getAdmins,
} = require("../controllers/adminControllers");

// Define routes
router.post("/add", createAdmin);
router.delete("/delete/:id", deleteAdmin);
router.get("/get", getAdmins);

module.exports = router;
