const express = require('express');
const router = express.Router();
const {createMuseum,getMuseum , bookm,
    getBookedHP,
    cancelHP,
    submitReview,updateMuseum,deleteMuseum,deleteAllMuseums,getMuseumById} = require('../controllers/MuseumCRUDcontroller');



// Define routes
router.post("/add", createMuseum);
router.get("/get", getMuseum);
router.put("/update/:id", updateMuseum);
router.delete("/delete/:id", deleteMuseum);
router.delete("/deleteAll", deleteAllMuseums);
router.get('/museum/:id', getMuseumById);
router.patch("/book/:id", bookm);
router.post("/cancelHP/:id", cancelHP);
router.post("/submitReview/:HPId", submitReview);
router.get("/getbookedHP", getBookedHP);

module.exports = router;
