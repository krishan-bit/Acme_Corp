const Shipment = require('../models/Shipment');

// @desc    Get shipments for user
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
    try {
        const { page = 1, limit = 50, status } = req.query;
        const userId = req.user.id;

        // Build query
        const query = { user: userId };

        // Add status filter if provided
        if (status) query.status = status;

        // Execute query with pagination
        const shipments = await Shipment.find(query)
            .sort({ 'dates.expectedDeliveryDate': -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Get total count for pagination
        const total = await Shipment.countDocuments(query);

        res.status(200).json({
            success: true,
            count: shipments.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            },
            data: shipments
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getShipments
};
