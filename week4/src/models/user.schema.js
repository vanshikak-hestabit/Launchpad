const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  status: Joi.string().valid("active", "inactive").optional()
});

module.exports = { createUserSchema };

// This file checks the incoming request body before creating a user.
// validates input from client

// ->firstName must be a string, at least 2 letters

// ->lastName must be a string, at least 2 letters

// ->email must be in correct email format

// ->password must be minimum 6 characters

// ->status can only be “active” or “inactive”