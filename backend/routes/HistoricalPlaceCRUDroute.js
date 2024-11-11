const express = require('express');
const router = express.Router();
const {createHistoricalPlace,getHistoricalPlace,updateHistoricalPlace,deleteHistoricalPlace, deleteAllHistoricalPlaces, flagHistoricalPlace,getHistoricalPlaceById} = require('../controllers/HistoricalPlaceCRUDcontroller');



// Define routes
router.post("/add", createHistoricalPlace);
router.get("/get", getHistoricalPlace);
router.get("/getbyid/:id", getHistoricalPlaceById);
router.put("/update/:id", updateHistoricalPlace);
router.delete("/delete/:id", deleteHistoricalPlace);
router.delete('/deleteAll', deleteAllHistoricalPlaces);
router.patch("/flag/:id", flagHistoricalPlace);

module.exports = router;
