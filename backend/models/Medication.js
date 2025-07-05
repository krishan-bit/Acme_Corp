const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    name: {
        type: String,
        required: [true, 'Medication name is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['semaglutide', 'liraglutide', 'tirzepatide', 'other'],
        required: [true, 'Medication type is required']
    },
    dosage: {
        type: String,
        required: [true, 'Dosage is required'],
        trim: true
    },
    frequency: {
        type: String,
        required: [true, 'Frequency is required'],
        trim: true
    },
    instructions: {
        type: String,
        trim: true,
        maxlength: [500, 'Instructions cannot exceed 500 characters']
    },
    prescribedDate: {
        type: Date,
        required: [true, 'Prescribed date is required'],
        default: Date.now
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'discontinued'],
        default: 'active'
    },
    remainingDays: {
        type: Number,
        min: [0, 'Remaining days cannot be negative']
    },
    prescriber: {
        name: {
            type: String,
            trim: true
        },
        contact: {
            type: String,
            trim: true
        }
    },
    sideEffects: [{
        type: String,
        trim: true
    }],
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        trim: true
    }
}, {
    timestamps: true
});

// Index for better query performance
medicationSchema.index({ user: 1, status: 1 });
medicationSchema.index({ 'prescribedDate': 1 });

module.exports = mongoose.model('Medication', medicationSchema);
