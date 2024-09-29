// #Task route solution
const express = require('express');
const router = express.Router();
const {createTourismGovernor,getTourismGovernor} = require('../controllers/tourismGovernorController');


// Define routes
router.post("/add", createTourismGovernor);
router.get("/get",getTourismGovernor );

module.exports = router;
