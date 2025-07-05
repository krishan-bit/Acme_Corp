require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');
const WeightEntry = require('./models/WeightEntry');
const Shipment = require('./models/Shipment');

const sampleData = {
    users: [
        {
            email: 'john.doe@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1-555-123-4567',
            dateOfBirth: new Date('1985-06-15'),
            gender: 'male',
            height: 180, // cm
            targetWeight: 80, // kg
            startDate: new Date('2024-01-15')
        },
        {
            email: 'jane.smith@example.com',
            password: 'password123',
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '+1-555-987-6543',
            dateOfBirth: new Date('1990-03-22'),
            gender: 'female',
            height: 165, // cm
            targetWeight: 65, // kg
            startDate: new Date('2024-02-01')
        }
    ]
};

const generateWeightEntries = (userId, startWeight, targetWeight, startDate) => {
    const entries = [];
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // Generate weight entries over time with gradual weight loss
    for (let i = 0; i <= daysDiff; i += 7) { // Weekly entries
        const entryDate = new Date(startDate);
        entryDate.setDate(entryDate.getDate() + i);
        
        // Simulate gradual weight loss with some fluctuation
        const progressRatio = i / Math.max(daysDiff, 1);
        const targetLoss = startWeight - targetWeight;
        const currentLoss = targetLoss * progressRatio * 0.7; // 70% progress towards goal
        const fluctuation = (Math.random() - 0.5) * 2; // ±1kg fluctuation
        const currentWeight = Math.round((startWeight - currentLoss + fluctuation) * 10) / 10;
        
        entries.push({
            user: userId,
            weight: Math.max(currentWeight, targetWeight - 5), // Don't go too far below target
            entryDate: entryDate,
            notes: i === 0 ? 'Starting weight' : 
                   (i % 28 === 0 ? 'Monthly check-in' : 
                   (Math.random() > 0.7 ? 'Feeling great today!' : ''))
        });
    }
    
    return entries;
};

const generateShipments = (userId, startDate, userIndex = 0) => {
    const shipments = [];
    const today = new Date();
    
    // Generate monthly shipments
    let currentDate = new Date(startDate);
    currentDate.setDate(1); // Start from first of the month
    
    let shipmentCount = 1;
    
    while (currentDate < today) {
        const orderDate = new Date(currentDate);
        const shippedDate = new Date(orderDate);
        shippedDate.setDate(shippedDate.getDate() + 2); // Ship 2 days after order
        
        const expectedDeliveryDate = new Date(shippedDate);
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 3); // 3-day delivery
        
        const actualDeliveryDate = new Date(expectedDeliveryDate);
        actualDeliveryDate.setDate(actualDeliveryDate.getDate() + Math.floor(Math.random() * 2)); // Sometimes delayed
        
        const isDelivered = actualDeliveryDate < today;
        
        shipments.push({
            user: userId,
            trackingNumber: `AC${String(userIndex + shipmentCount).padStart(8, '0')}`,
            status: isDelivered ? 'delivered' : 
                   (shippedDate < today ? 'in_transit' : 'pending'),
            medication: {
                name: 'Semaglutide',
                type: 'semaglutide',
                dosage: '0.25mg',
                quantity: 4,
                unit: 'pens'
            },
            shippingAddress: {
                street: '123 Main Street',
                city: 'Anytown',
                state: 'CA',
                zipCode: '90210',
                country: 'United States'
            },
            dates: {
                orderDate: orderDate,
                shippedDate: shippedDate < today ? shippedDate : null,
                expectedDeliveryDate: expectedDeliveryDate,
                actualDeliveryDate: isDelivered ? actualDeliveryDate : null
            },
            carrier: 'FedEx',
            cost: {
                medication: 299.99,
                shipping: 0,
                total: 299.99
            },
            notes: shipmentCount === 1 ? 'First shipment - starter dose' : ''
        });
        
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
        shipmentCount++;
    }
    
    return shipments;
};

const seedData = async () => {
    try {
        console.log('🌱 Starting data seeding...');
        
        // Connect to database
        await connectDB();
        
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany();
        await WeightEntry.deleteMany();
        await Shipment.deleteMany();
        
        // Create users
        console.log('👥 Creating users...');
        const createdUsers = [];
        
        for (const userData of sampleData.users) {
            const user = await User.create(userData);
            createdUsers.push(user);
            console.log(`✅ Created user: ${user.fullName} (${user.email})`);
        }
        
        // Create weight entries for each user
        console.log('⚖️  Creating weight entries...');
        for (const user of createdUsers) {
            const startWeight = user.targetWeight + 15 + Math.random() * 10; // Start 15-25kg above target
            const weightEntries = generateWeightEntries(user._id, startWeight, user.targetWeight, user.startDate);
            
            await WeightEntry.insertMany(weightEntries);
            console.log(`✅ Created ${weightEntries.length} weight entries for ${user.fullName}`);
        }
        
        // Create shipments for each user
        console.log('📦 Creating shipments...');
        let globalShipmentCount = 1;
        for (let i = 0; i < createdUsers.length; i++) {
            const user = createdUsers[i];
            const shipments = generateShipments(user._id, user.startDate, globalShipmentCount);
            globalShipmentCount += shipments.length;
            
            await Shipment.insertMany(shipments);
            console.log(`✅ Created ${shipments.length} shipments for ${user.fullName}`);
        }
        
        console.log('🎉 Data seeding completed successfully!');
        console.log('\\n📋 Test Accounts Created:');
        createdUsers.forEach(user => {
            console.log(`   Email: ${user.email} | Password: password123`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

// Run seeder
seedData();
