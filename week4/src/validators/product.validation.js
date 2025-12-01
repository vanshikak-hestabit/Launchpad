const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(2).required(),
  price: Joi.number().min(1).required(),
  rating: Joi.number().min(0).max(5).optional(),
  status: Joi.string().valid("available", "out_of_stock").optional()
});

module.exports = productSchema;
