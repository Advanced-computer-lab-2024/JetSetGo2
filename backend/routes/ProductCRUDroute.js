const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  deleteAllProducts
} = require('../controllers/ProductCRUDcontroller'); // Adjust the path if needed


// Define the routes
router.post('/add', createProduct);
router.get('/get', getProducts);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.delete('/deleteall', deleteAllProducts);

module.exports = router;
