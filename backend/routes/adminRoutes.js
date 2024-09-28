// #Task route solution
const express = require('express');
const router = express.Router();
const {createAdmin,deleteAdmin} = require('../controllers/adminControllers');

// Define routes
router.post("/addAdmin", createAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);

module.exports = router;

