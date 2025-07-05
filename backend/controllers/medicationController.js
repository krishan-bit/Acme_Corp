const Medication = require('../models/Medication');

// @desc    Get medications for user
// @route   GET /api/medications
// @access  Private
const getMedications = async (req, res) => {
    try {
        const { page = 1, limit = 50, status } = req.query;
        const userId = req.user.id;

        // Build query
        const query = { user: userId };

        // Add status filter if provided
        if (status) query.status = status;

        // Execute query with pagination
        const medications = await Medication.find(query)
            .sort({ prescribedDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Get total count for pagination
        const total = await Medication.countDocuments(query);

        res.status(200).json({
            success: true,
            count: medications.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            },
            medications: medications
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new medication
// @route   POST /api/medications
// @access  Private
const createMedication = async (req, res) => {
    try {
        const medicationData = {
            ...req.body,
            user: req.user.id
        };

        const medication = await Medication.create(medicationData);

        res.status(201).json({
            success: true,
            data: medication
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
const updateMedication = async (req, res) => {
    try {
        const medication = await Medication.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: 'Medication not found'
            });
        }

        res.status(200).json({
            success: true,
            data: medication
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private
const deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: 'Medication not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
};
