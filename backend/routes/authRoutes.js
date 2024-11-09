const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");

router.post("/login", loginUser); // Route for user login

module.exports = router;
