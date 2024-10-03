const express = require('express');
const router = express.Router();
const {createHistoricalPlace,getHistoricalPlace,updateHistoricalPlace,deleteHistoricalPlace} = require('../controllers/HistoricalPlaceCRUDcontroller');



// Define routes
router.post("/add", createHistoricalPlace);
router.get("/get", getHistoricalPlace);
router.put("/update/:id", updateHistoricalPlace);
router.delete("/delete/:id", deleteHistoricalPlace);

module.exports = router;
