const Patient = require('../models/Patient');

const getAllPatients = async (req, res) => {
    try {
        const { search, status, condition, page = 1, limit = 10 } = req.query;
        
        // Build query object
        let query = {};
        
        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Filter by condition
        if (condition) {
            query.condition = { $regex: condition, $options: 'i' };
        }
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        const limitNum = parseInt(limit);
        
        // Execute queries
        const [patients, totalCount] = await Promise.all([
            Patient.find(query)
                .skip(skip)
                .limit(limitNum)
                .sort({ createdAt: -1 }),
            Patient.countDocuments(query)
        ]);
        
        res.json({
            patients,
            totalCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limitNum),
            hasNextPage: page < Math.ceil(totalCount / limitNum),
            hasPrevPage: page > 1
        });
        
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ 
            message: 'Error fetching patients', 
            error: error.message 
        });
    }
};

const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(500).json({ 
            message: 'Error fetching patient', 
            error: error.message 
        });
    }
};

const createPatient = async (req, res) => {
    try {
        const patientData = {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            phone: req.body.phone,
            condition: req.body.condition,
            status: req.body.status || 'active',
            medication: {
                type: req.body.medicationType || 'semaglutide',
                dosage: req.body.medicationDosage || '0.25mg'
            }
        };
        
        const patient = new Patient(patientData);
        const savedPatient = await patient.save();
        
        res.status(201).json(savedPatient);
    } catch (error) {
        console.error('Error creating patient:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Patient with this email already exists',
                error: 'Duplicate email address'
            });
        }
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
        res.status(500).json({ 
            message: 'Error creating patient', 
            error: error.message 
        });
    }
};

const updatePatient = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            phone: req.body.phone,
            condition: req.body.condition,
            status: req.body.status
        };
        
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            updateData,
            { 
                new: true, // Return updated document
                runValidators: true // Run schema validations
            }
        );
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        res.json(patient);
    } catch (error) {
        console.error('Error updating patient:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Email already exists for another patient',
                error: 'Duplicate email address'
            });
        }
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        res.status(500).json({ 
            message: 'Error updating patient', 
            error: error.message 
        });
    }
};

const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        res.json({ 
            message: 'Patient deleted successfully',
            deletedPatient: patient
        });
    } catch (error) {
        console.error('Error deleting patient:', error);
        
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Patient not found' });
        }
        
        res.status(500).json({ 
            message: 'Error deleting patient', 
            error: error.message 
        });
    }
};

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
};