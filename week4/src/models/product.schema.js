const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(1).required(),
  price: Joi.number().min(0).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  status: Joi.string().valid('available', 'out_of_stock').optional()
});

module.exports = { createProductSchema };

// This file checks the product data before saving it.

// ->name → string, required
// ->price → number ≥ 0, required
// ->tags → optional array of strings
// ->rating → optional number (0–5)
// ->status → optional, must be "available" or "out_of_stock"