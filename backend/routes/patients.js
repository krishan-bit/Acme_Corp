// const express = require('express');
// const router = express.Router();

// // Sample patient data (in a real app, this would come from a database)
// let patients = [
//   {
//     id: 1,
//     name: "John Doe",
//     age: 45,
//     email: "john.doe@email.com",
//     phone: "555-0123",
//     condition: "Hypertension",
//     lastVisit: "2024-01-15",
//     status: "active"
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     age: 32,
//     email: "jane.smith@email.com",
//     phone: "555-0456",
//     condition: "Diabetes",
//     lastVisit: "2024-01-10",
//     status: "active"
//   },
//   {
//     id: 3,
//     name: "Bob Johnson",
//     age: 58,
//     email: "bob.johnson@email.com",
//     phone: "555-0789",
//     condition: "Heart Disease",
//     lastVisit: "2024-01-20",
//     status: "inactive"
//   }
// ];

// // GET all patients
// router.get('/', (req, res) => {
//   res.json(patients);
// });

// // GET patient by ID
// router.get('/:id', (req, res) => {
//   const patient = patients.find(p => p.id === parseInt(req.params.id));
//   if (!patient) {
//     return res.status(404).json({ message: 'Patient not found' });
//   }
//   res.json(patient);
// });

// // POST new patient
// router.post('/', (req, res) => {
//   const newPatient = {
//     id: patients.length + 1,
//     name: req.body.name,
//     age: req.body.age,
//     email: req.body.email,
//     phone: req.body.phone,
//     condition: req.body.condition,
//     lastVisit: new Date().toISOString().split('T')[0],
//     status: 'active'
//   };
//   patients.push(newPatient);
//   res.status(201).json(newPatient);
// });

// // PUT update patient
// router.put('/:id', (req, res) => {
//   const patient = patients.find(p => p.id === parseInt(req.params.id));
//   if (!patient) {
//     return res.status(404).json({ message: 'Patient not found' });
//   }
  
//   Object.assign(patient, req.body);
//   res.json(patient);
// });

// // DELETE patient
// router.delete('/:id', (req, res) => {
//   const index = patients.findIndex(p => p.id === parseInt(req.params.id));
//   if (index === -1) {
//     return res.status(404).json({ message: 'Patient not found' });
//   }
  
//   patients.splice(index, 1);
//   res.json({ message: 'Patient deleted successfully' });
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { validatePatient } = require('../middleware/validation');
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');

// GET all patients (with search, filter, pagination)
router.get('/', getAllPatients);

// GET patient by ID
router.get('/:id', getPatientById);

// POST new patient (with validation)
router.post('/', validatePatient, createPatient);

// PUT update patient (with validation)
router.put('/:id', validatePatient, updatePatient);

// DELETE patient
router.delete('/:id', deletePatient);

module.exports = router;