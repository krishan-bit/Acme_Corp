const WeightEntry = require('../models/WeightEntry');
const User = require('../models/User');

// @desc    Get weight entries for user
// @route   GET /api/weight
// @access  Private
const getWeightEntries = async (req, res) => {
    try {
        const { page = 1, limit = 50, startDate, endDate } = req.query;
        const userId = req.user.id;

        // Build query
        const query = { user: userId };

        // Add date filters if provided
        if (startDate || endDate) {
            query.entryDate = {};
            if (startDate) query.entryDate.$gte = new Date(startDate);
            if (endDate) query.entryDate.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const weightEntries = await WeightEntry.find(query)
            .sort({ entryDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user', 'firstName lastName height');

        // Get total count for pagination
        const total = await WeightEntry.countDocuments(query);

        res.status(200).json({
            success: true,
            count: weightEntries.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            },
            data: weightEntries
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get weight progress chart data
// @route   GET /api/weight/progress
// @access  Private
const getWeightProgress = async (req, res) => {
    try {
        const { period = '3months' } = req.query;
        const userId = req.user.id;
        
        // Calculate date range based on period
        let startDate = new Date();
        switch (period) {
            case '1month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case '3months':
                startDate.setMonth(startDate.getMonth() - 3);
                break;
            case '6months':
                startDate.setMonth(startDate.getMonth() - 6);
                break;
            case '1year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(startDate.getMonth() - 3);
        }

        // Get weight entries for the period
        const weightEntries = await WeightEntry.find({
            user: userId,
            entryDate: { $gte: startDate }
        }).sort({ entryDate: 1 });

        // Get user info for calculations
        const user = await User.findById(userId);

        // Format data for chart
        const chartData = weightEntries.map(entry => ({
            date: entry.entryDate,
            weight: entry.weight,
            bmi: entry.bmi || (user.height ? entry.calculateBMI(user.height) : null),
            notes: entry.notes
        }));

        // Calculate statistics
        const weights = weightEntries.map(entry => entry.weight);
        const stats = weights.length > 0 ? {
            currentWeight: weights[weights.length - 1],
            startWeight: weights[0],
            lowestWeight: Math.min(...weights),
            highestWeight: Math.max(...weights),
            totalWeightLoss: weights[0] - weights[weights.length - 1],
            averageWeight: weights.reduce((sum, weight) => sum + weight, 0) / weights.length,
            totalEntries: weights.length
        } : null;

        res.status(200).json({
            success: true,
            data: {
                period,
                chartData,
                stats,
                targetWeight: user.targetWeight
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add new weight entry
// @route   POST /api/weight
// @access  Private
const addWeightEntry = async (req, res) => {
    try {
        const { weight, notes, entryDate } = req.body;
        const userId = req.user.id;

        // Get user for BMI calculation
        const user = await User.findById(userId);

        // Create weight entry
        const weightEntry = await WeightEntry.create({
            user: userId,
            weight,
            notes,
            entryDate: entryDate || Date.now()
        });

        // Calculate and save BMI if height is available
        if (user.height) {
            weightEntry.bmi = weightEntry.calculateBMI(user.height);
            await weightEntry.save();
        }

        await weightEntry.populate('user', 'firstName lastName height');

        res.status(201).json({
            success: true,
            data: weightEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update weight entry
// @route   PUT /api/weight/:id
// @access  Private
const updateWeightEntry = async (req, res) => {
    try {
        const { weight, notes, entryDate } = req.body;
        const userId = req.user.id;

        // Find the weight entry and ensure it belongs to the user
        let weightEntry = await WeightEntry.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!weightEntry) {
            return res.status(404).json({
                success: false,
                message: 'Weight entry not found'
            });
        }

        // Update fields
        if (weight !== undefined) weightEntry.weight = weight;
        if (notes !== undefined) weightEntry.notes = notes;
        if (entryDate !== undefined) weightEntry.entryDate = entryDate;

        // Recalculate BMI if weight changed
        if (weight !== undefined) {
            const user = await User.findById(userId);
            if (user.height) {
                weightEntry.bmi = weightEntry.calculateBMI(user.height);
            }
        }

        await weightEntry.save();
        await weightEntry.populate('user', 'firstName lastName height');

        res.status(200).json({
            success: true,
            data: weightEntry
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete weight entry
// @route   DELETE /api/weight/:id
// @access  Private
const deleteWeightEntry = async (req, res) => {
    try {
        const userId = req.user.id;

        const weightEntry = await WeightEntry.findOneAndDelete({
            _id: req.params.id,
            user: userId
        });

        if (!weightEntry) {
            return res.status(404).json({
                success: false,
                message: 'Weight entry not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Weight entry deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getWeightEntries,
    getWeightProgress,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry
};
