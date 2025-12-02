
const { generateRequestId } = require('../utils/tracing');

function requestIdMiddleware(req, res, next) {

  // Check if client already sent X-Request-ID
  const incomingId = req.headers['x-request-id'];

  // If present → use it  else  → generate one
  const requestId = incomingId || generateRequestId();

  // Attach to req → now available everywhere
  req.requestId = requestId;

  // Add to response header also
  res.setHeader('X-Request-ID', requestId);

  next();
}

module.exports = requestIdMiddleware;

// gives every request a unique ID so you can track it easily in logs.