const express = require('express');
const { protect } = require('../middleware/auth');
const { getShipments } = require('../controllers/shipmentController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Shipment routes
router.get('/', getShipments);

module.exports = router;
