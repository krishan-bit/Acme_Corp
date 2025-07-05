const express = require('express');
const { protect } = require('../middleware/auth');
const { getDashboardOverview } = require('../controllers/dashboardController');

const router = express.Router();

// Dashboard routes
router.get('/overview', protect, getDashboardOverview);

module.exports = router;
