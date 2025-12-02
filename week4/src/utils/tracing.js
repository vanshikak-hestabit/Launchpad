
const { randomUUID } = require('crypto');

// Generate a new random ID
function generateRequestId() {
  return randomUUID();
}

module.exports = { generateRequestId };

// It creates unique IDs for each request so you can trace them in logs.that are then used in requestID middleware
// randomUUID built in func that generated random unique ID