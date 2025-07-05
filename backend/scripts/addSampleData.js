const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Medication = require('../models/Medication');
const Shipment = require('../models/Shipment');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

const addSampleData = async () => {
    try {
        // Find a user to associate data with (use the first user found)
        const user = await User.findOne();
        if (!user) {
            console.log('No users found. Please register a user first.');
            return;
        }

        console.log(`Adding sample data for user: ${user.email}`);

        // Add sample medications
        const sampleMedications = [
            {
                user: user._id,
                name: 'Semaglutide',
                type: 'semaglutide',
                dosage: '0.25mg',
                frequency: 'Once weekly',
                instructions: 'Inject subcutaneously in abdomen, thigh, or upper arm',
                prescribedDate: new Date('2024-01-15'),
                status: 'active',
                remainingDays: 21,
                prescriber: {
                    name: 'Dr. Sarah Johnson',
                    contact: '(555) 123-4567'
                },
                notes: 'Start with low dose and gradually increase'
            },
            {
                user: user._id,
                name: 'Tirzepatide',
                type: 'tirzepatide',
                dosage: '5mg',
                frequency: 'Once weekly',
                instructions: 'Inject subcutaneously, rotate injection sites',
                prescribedDate: new Date('2024-02-01'),
                status: 'active',
                remainingDays: 14,
                prescriber: {
                    name: 'Dr. Michael Chen',
                    contact: '(555) 987-6543'
                },
                sideEffects: ['Nausea', 'Decreased appetite'],
                notes: 'Monitor blood glucose levels'
            },
            {
                user: user._id,
                name: 'Metformin',
                type: 'other',
                dosage: '500mg',
                frequency: 'Twice daily',
                instructions: 'Take with meals to reduce stomach upset',
                prescribedDate: new Date('2023-11-10'),
                status: 'active',
                remainingDays: 30,
                prescriber: {
                    name: 'Dr. Sarah Johnson',
                    contact: '(555) 123-4567'
                },
                notes: 'Long-term diabetes management'
            }
        ];

        // Add sample shipments
        const sampleShipments = [
            {
                user: user._id,
                trackingNumber: 'TRK001234567',
                status: 'in_transit',
                medication: {
                    name: 'Semaglutide',
                    type: 'semaglutide',
                    dosage: '0.25mg',
                    quantity: 4,
                    unit: 'pens'
                },
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'United States'
                },
                dates: {
                    orderDate: new Date('2024-01-20'),
                    shippedDate: new Date('2024-01-22'),
                    expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
                },
                carrier: 'FedEx',
                cost: {
                    medication: 299.99,
                    shipping: 15.00,
                    total: 314.99
                },
                notes: 'Requires refrigeration upon delivery'
            },
            {
                user: user._id,
                trackingNumber: 'TRK001234568',
                status: 'delivered',
                medication: {
                    name: 'Tirzepatide',
                    type: 'tirzepatide',
                    dosage: '5mg',
                    quantity: 2,
                    unit: 'pens'
                },
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'United States'
                },
                dates: {
                    orderDate: new Date('2024-01-10'),
                    shippedDate: new Date('2024-01-12'),
                    expectedDeliveryDate: new Date('2024-01-15'),
                    actualDeliveryDate: new Date('2024-01-15')
                },
                carrier: 'UPS',
                cost: {
                    medication: 599.99,
                    shipping: 20.00,
                    total: 619.99
                }
            },
            {
                user: user._id,
                trackingNumber: 'TRK001234569',
                status: 'pending',
                medication: {
                    name: 'Semaglutide',
                    type: 'semaglutide',
                    dosage: '0.5mg',
                    quantity: 4,
                    unit: 'pens'
                },
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345',
                    country: 'United States'
                },
                dates: {
                    orderDate: new Date(),
                    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
                },
                carrier: 'FedEx',
                cost: {
                    medication: 349.99,
                    shipping: 15.00,
                    total: 364.99
                },
                isEmergencyShipment: false
            }
        ];

        // Clear existing data for this user
        await Medication.deleteMany({ user: user._id });
        await Shipment.deleteMany({ user: user._id });

        // Insert sample data
        await Medication.insertMany(sampleMedications);
        await Shipment.insertMany(sampleShipments);

        console.log('Sample data added successfully!');
        console.log(`Added ${sampleMedications.length} medications`);
        console.log(`Added ${sampleShipments.length} shipments`);
        
    } catch (error) {
        console.error('Error adding sample data:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the script
connectDB().then(() => {
    addSampleData();
});
