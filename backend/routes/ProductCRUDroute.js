const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  archiveProduct,
  unarchiveProduct
} = require('../controllers/ProductCRUDcontroller'); // Adjust the path if needed


// Define the routes
router.post('/add', createProduct);
router.get('/get', getProducts);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.delete('/deleteall', deleteAllProducts);
// New routes for archiving/unarchiving
router.patch('/archive/:id', archiveProduct);
router.patch('/unarchive/:id', unarchiveProduct);

module.exports = router;
