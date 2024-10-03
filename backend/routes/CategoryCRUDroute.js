const express = require('express');
const router = express.Router();
const {createCategory,getCategory,updateCategory,deleteCategory} = require('../controllers/CategoryCRUDcontroller');

// Define routes
router.post("/add", createCategory);
router.get("/get", getCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
