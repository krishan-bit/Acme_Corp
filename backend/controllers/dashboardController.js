const User = require('../models/User');
const WeightEntry = require('../models/WeightEntry');
const Shipment = require('../models/Shipment');

// @desc    Get dashboard overview
// @route   GET /api/dashboard/overview
// @access  Private
const getDashboardOverview = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user info
        const user = await User.findById(userId);

        // Get latest weight entry
        const latestWeightEntry = await WeightEntry.findOne({ user: userId })
            .sort({ entryDate: -1 });

        // Get weight entries from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentWeightEntries = await WeightEntry.find({
            user: userId,
            entryDate: { $gte: thirtyDaysAgo }
        }).sort({ entryDate: -1 });

        // Calculate weight loss progress
        let weightProgress = null;
        let currentBMI = null;
        
        if (latestWeightEntry && user.height) {
            currentBMI = latestWeightEntry.calculateBMI(user.height);
            
            // Calculate progress towards target
            if (user.targetWeight) {
                const currentWeight = latestWeightEntry.weight;
                const startWeight = recentWeightEntries.length > 0 ? 
                    recentWeightEntries[recentWeightEntries.length - 1].weight : currentWeight;
                const targetWeight = user.targetWeight;
                
                const totalWeightToLose = Math.abs(startWeight - targetWeight);
                const weightLost = Math.abs(startWeight - currentWeight);
                const progressPercentage = totalWeightToLose > 0 ? 
                    Math.round((weightLost / totalWeightToLose) * 100) : 0;

                weightProgress = {
                    currentWeight,
                    startWeight,
                    targetWeight,
                    weightLost,
                    progressPercentage,
                    remainingWeight: Math.abs(currentWeight - targetWeight)
                };
            }
        }

        // Get upcoming shipments
        const upcomingShipments = await Shipment.find({
            user: userId,
            status: { $in: ['pending', 'shipped', 'in_transit'] }
        }).sort({ 'dates.expectedDeliveryDate': 1 }).limit(3);

        // Get recent shipments
        const recentShipments = await Shipment.find({
            user: userId,
            status: 'delivered'
        }).sort({ 'dates.actualDeliveryDate': -1 }).limit(3);

        // Calculate days since program start
        const programStartDate = user.startDate;
        const daysSinceStart = Math.floor(
            (Date.now() - programStartDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Get total weight entries count
        const totalWeightEntries = await WeightEntry.countDocuments({ user: userId });

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    startDate: user.startDate,
                    targetWeight: user.targetWeight,
                    height: user.height,
                    daysSinceStart
                },
                currentWeight: latestWeightEntry ? latestWeightEntry.weight : null,
                currentBMI,
                weightProgress,
                upcomingShipments: upcomingShipments.map(shipment => ({
                    id: shipment._id,
                    trackingNumber: shipment.trackingNumber,
                    status: shipment.status,
                    expectedDelivery: shipment.dates.expectedDeliveryDate,
                    daysUntilDelivery: shipment.daysUntilDelivery,
                    medication: shipment.medication
                })),
                recentShipments: recentShipments.map(shipment => ({
                    id: shipment._id,
                    trackingNumber: shipment.trackingNumber,
                    status: shipment.status,
                    deliveryDate: shipment.dates.actualDeliveryDate,
                    medication: shipment.medication
                })),
                stats: {
                    totalWeightEntries,
                    recentEntriesCount: recentWeightEntries.length,
                    totalShipments: await Shipment.countDocuments({ user: userId }),
                    pendingShipments: upcomingShipments.length
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardOverview
};
