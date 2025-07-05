const Joi = require('joi');

const patientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  age: Joi.number().integer().min(0).max(150).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9-+().\s]+$/).required(),
  condition: Joi.string().min(2).max(200).required(),
  status: Joi.string().valid('active', 'inactive').optional()
});

const validatePatient = (req, res, next) => {
  const { error } = patientSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = { validatePatient };