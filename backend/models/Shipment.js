const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    trackingNumber: {
        type: String,
        required: [true, 'Tracking number is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'in_transit', 'delivered', 'cancelled'],
        default: 'pending'
    },
    medication: {
        name: {
            type: String,
            required: [true, 'Medication name is required'],
            trim: true
        },
        type: {
            type: String,
            enum: ['semaglutide', 'liraglutide', 'tirzepatide'],
            required: [true, 'Medication type is required']
        },
        dosage: {
            type: String,
            required: [true, 'Dosage is required'],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        unit: {
            type: String,
            enum: ['pens', 'vials', 'boxes'],
            default: 'pens'
        }
    },
    shippingAddress: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        zipCode: {
            type: String,
            required: [true, 'ZIP code is required'],
            trim: true
        },
        country: {
            type: String,
            default: 'United States',
            trim: true
        }
    },
    dates: {
        orderDate: {
            type: Date,
            required: [true, 'Order date is required'],
            default: Date.now
        },
        shippedDate: {
            type: Date
        },
        expectedDeliveryDate: {
            type: Date,
            required: [true, 'Expected delivery date is required']
        },
        actualDeliveryDate: {
            type: Date
        }
    },
    carrier: {
        type: String,
        enum: ['FedEx', 'UPS', 'USPS', 'DHL'],
        default: 'FedEx'
    },
    cost: {
        medication: {
            type: Number,
            min: [0, 'Cost cannot be negative']
        },
        shipping: {
            type: Number,
            min: [0, 'Shipping cost cannot be negative']
        },
        total: {
            type: Number,
            min: [0, 'Total cost cannot be negative']
        }
    },
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        trim: true
    },
    isEmergencyShipment: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Virtual for days until delivery
shipmentSchema.virtual('daysUntilDelivery').get(function() {
    if (this.status === 'delivered' || !this.dates.expectedDeliveryDate) return null;
    
    const today = new Date();
    const deliveryDate = this.dates.expectedDeliveryDate;
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
});

// Virtual for shipment duration
shipmentSchema.virtual('shipmentDuration').get(function() {
    if (!this.dates.shippedDate || !this.dates.actualDeliveryDate) return null;
    
    const diffTime = this.dates.actualDeliveryDate - this.dates.shippedDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
});

// Index for better query performance
shipmentSchema.index({ user: 1, status: 1 });
shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ 'dates.expectedDeliveryDate': 1 });

module.exports = mongoose.model('Shipment', shipmentSchema);
