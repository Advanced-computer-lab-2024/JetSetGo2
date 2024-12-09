const express = require('express');
const { generateSalesReport } = require('../controllers/SalesReportController');
const router = express.Router();

// Route to generate sales report
router.post('/generate', generateSalesReport);

module.exports = router;

