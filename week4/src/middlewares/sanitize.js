const sanitizeHtml = require("sanitize-html");

function sanitize(req, res, next) {
  const sanitizeValue = (value) => {
    // if input is a string remove all tags and attributes
    if (typeof value === "string") {
      return sanitizeHtml(value, {
        allowedTags: [],         
        allowedAttributes: {}    
      });
    }
    
    // If input is an array Sanitize each item.
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }

    // if input is an object Sanitizes each field inside object
    if (typeof value === "object" && value !== null) {
      const sanitized = {};
      for (let key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }

    return value;
  };

  // Apply sanitization to request
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);

  next();
}

module.exports = sanitize;

// this removes all HTML tags to block XSS attacks