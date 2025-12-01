const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  status: Joi.string().valid("active", "inactive").optional()
});

module.exports = { createUserSchema };
