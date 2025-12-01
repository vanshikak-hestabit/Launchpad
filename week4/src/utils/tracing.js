// /utils/tracing.js
const { randomUUID } = require('crypto');

// Generate a new random ID
function generateRequestId() {
  return randomUUID();
}

module.exports = { generateRequestId };
