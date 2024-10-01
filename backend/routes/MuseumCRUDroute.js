const express = require('express');
const router = express.Router();
const {createMuseum,getMuseum,updateMuseum,deleteMuseum} = require('../controllers/MuseumCRUDcontroller');



// Define routes
router.post("/add", createMuseum);
router.get("/get", getMuseum);
router.put("/update", updateMuseum);
router.delete("/delete", deleteMuseum);

module.exports = router;
