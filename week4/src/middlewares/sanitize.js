const sanitizeHtml = require("sanitize-html");

function sanitize(req, res, next) {
  const sanitizeValue = (value) => {
    if (typeof value === "string") {
      return sanitizeHtml(value, {
        allowedTags: [],         // remove ALL html tags
        allowedAttributes: {}    // remove ALL attributes
      });
    }

    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }

    if (typeof value === "object" && value !== null) {
      const sanitized = {};
      for (let key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }

    return value;
  };

  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);

  next();
}

module.exports = sanitize;
