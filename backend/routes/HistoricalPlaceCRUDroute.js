const express = require('express');
const router = express.Router();
const {createHistoricalPlace,getHistoricalPlace,updateHistoricalPlace,deleteHistoricalPlace, deleteAllHistoricalPlaces, flagHistoricalPlace,getHistoricalPlaceById,bookHP,getBookedHP,cancelHP,submitReview} = require('../controllers/HistoricalPlaceCRUDcontroller');
const { get } = require('mongoose');



// Define routes
router.post("/add", createHistoricalPlace);
router.get("/get", getHistoricalPlace);
router.get("/getbyid/:id", getHistoricalPlaceById);
router.put("/update/:id", updateHistoricalPlace);
router.delete("/delete/:id", deleteHistoricalPlace);
router.delete('/deleteAll', deleteAllHistoricalPlaces);
router.patch("/book/:id", bookHP);
router.post("/cancelHP/:id", cancelHP);
router.post("/submitReview/:HPId", submitReview);
router.get("/getbookedHP", getBookedHP);router.patch("/flag/:id", flagHistoricalPlace);

module.exports = router;
