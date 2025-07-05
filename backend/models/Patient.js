const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age cannot be negative'],
        max: [150, 'Age cannot exceed 150']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9-+().\s]+$/, 'Please enter a valid phone number']
    },
    condition: {
        type: String,
        required: [true, 'Medical condition is required'],
        trim: true,
        minlength: [2, 'Condition must be at least 2 characters'],
        maxlength: [200, 'Condition cannot exceed 200 characters']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    weightEntries: [{
        date: Date,
        weight: Number
    }],
    
    bmi: Number,
    
    medication: {
        type: {
            type: String,
            required: true
        },
        dosage: String,
    },

    shipments: [{
        dateShipped: Date,
        expectedDelivery: Date,
        status: String,
        trackingNumber: String
    }],

    lastVisit: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better search performance
patientSchema.index({ name: 'text', condition: 'text' });

module.exports = mongoose.model('Patient', patientSchema);