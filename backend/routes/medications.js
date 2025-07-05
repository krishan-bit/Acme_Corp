const express = require('express');
const { protect } = require('../middleware/auth');
const {
    getMedications,
    createMedication,
    updateMedication,
    deleteMedication
} = require('../controllers/medicationController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Medication routes
router.get('/', getMedications);
router.post('/', createMedication);
router.put('/:id', updateMedication);
router.delete('/:id', deleteMedication);

module.exports = router;
