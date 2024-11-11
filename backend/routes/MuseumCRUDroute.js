const express = require('express');
const router = express.Router();
const {createMuseum,getMuseum,updateMuseum,deleteMuseum,deleteAllMuseums, flagMuseum,getMuseumById} = require('../controllers/MuseumCRUDcontroller');



// Define routes
router.post("/add", createMuseum);
router.get("/get", getMuseum);
router.put("/update/:id", updateMuseum);
router.delete("/delete/:id", deleteMuseum);
router.delete("/deleteAll", deleteAllMuseums);
router.patch("/flag/:id", flagMuseum);
router.get('/museum/:id', getMuseumById);


module.exports = router;
