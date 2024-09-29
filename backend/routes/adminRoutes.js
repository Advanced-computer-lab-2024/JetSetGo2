// #Task route solution
const express = require('express');
const router = express.Router();
const {createAdmin,deleteAdmin,getAdmin} = require('../controllers/adminControllers');

// Define routes
router.post("/add", createAdmin);
router.delete("/delete/:id", deleteAdmin);
router.get("/get",getAdmin );

module.exports = router;

