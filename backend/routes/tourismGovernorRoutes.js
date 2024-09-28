// #Task route solution
const express = require('express');
const router = express.Router();
const {createTourismGovernor} = require('../controllers/tourismGovernorController');


// Define routes
router.post("/addTourismGovernor", createTourismGovernor);

module.exports = router;
