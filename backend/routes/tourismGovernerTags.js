const express = require('express');
const {createTags, readGuide}=require("../controllers/tourismGovernerTags");
const router = express.Router();



// Define routes
router.post("/add", createTags);
router.get("/get", readGuide);

module.exports = router;