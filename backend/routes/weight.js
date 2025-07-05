const express = require('express');
const { protect } = require('../middleware/auth');
const {
    getWeightEntries,
    getWeightProgress,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry
} = require('../controllers/weightController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Weight entry routes
router.route('/')
    .get(getWeightEntries)
    .post(addWeightEntry);

router.get('/progress', getWeightProgress);

router.route('/:id')
    .put(updateWeightEntry)
    .delete(deleteWeightEntry);

module.exports = router;
