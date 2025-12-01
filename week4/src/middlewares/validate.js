const Joi = require("joi");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(err => err.message),
      });
    }

    next();
  };
};

module.exports = validate;


//this file will protect out DB from bad input like
//empty product name, negative price, invalid email, 
// weak password, missing fields,random unwanted data
//this file validate the req body using Joi
//if invalid -> return clean error msg
// if valid -> move to controller