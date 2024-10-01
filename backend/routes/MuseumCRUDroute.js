const express = require('express');
const router = express.Router();
const {createMuseum,getMuseum,updateMuseum,deleteMuseum} = require('../controllers/MuseumCRUDcontroller');



// Define routes
router.post("/add", createMuseum);
router.get("/get", getMuseum);
router.put("/update/:id", updateMuseum);
router.delete("/delete/:id", deleteMuseum);

module.exports = router;
