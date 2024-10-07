// #Task route solution
const express = require('express');
const router = express.Router();
const {createTourismGovernor,getTourismGovernor, deleteTourismGovernor} = require('../controllers/tourismGovernorController');


// Define routes
router.post("/add", createTourismGovernor);
router.get("/get",getTourismGovernor );
router.delete("/delete/:id", deleteTourismGovernor);


module.exports = router;
