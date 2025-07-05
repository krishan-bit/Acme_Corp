const mongoose = require('mongoose');

const weightEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [30, 'Weight must be at least 30kg'],
        max: [300, 'Weight cannot exceed 300kg']
    },
    bmi: {
        type: Number,
        min: [10, 'BMI must be at least 10'],
        max: [50, 'BMI cannot exceed 50']
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters'],
        trim: true
    },
    entryDate: {
        type: Date,
        required: [true, 'Entry date is required'],
        default: Date.now
    },
    isManualEntry: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate BMI virtual method
weightEntrySchema.methods.calculateBMI = function(height) {
    if (!height || height <= 0) return null;
    const heightInMeters = height / 100;
    return Math.round((this.weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

// Index for better query performance
weightEntrySchema.index({ user: 1, entryDate: -1 });

module.exports = mongoose.model('WeightEntry', weightEntrySchema);
