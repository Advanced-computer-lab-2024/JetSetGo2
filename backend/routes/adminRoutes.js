// #Task route solution
const express = require("express");
const router = express.Router();
const {
  createAdmin,
  deleteAdmin,
  getAdmins,
  updatePassword,
  getTotalUsers, // Import the new controller method
  getNewUsersByMonth, // Add this line
} = require("../controllers/adminControllers");

// Define routes
router.post("/add", createAdmin);
router.delete("/delete/:id", deleteAdmin);
router.get("/get", getAdmins);
router.put("/update-password/:id", updatePassword);
router.get("/total-users", getTotalUsers); // New route for fetching total users
router.get("/monthly-users", getNewUsersByMonth); // New route for fetching total users

module.exports = router;
