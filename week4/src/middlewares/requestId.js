// /middlewares/requestId.js
const { generateRequestId } = require('../utils/tracing');

function requestIdMiddleware(req, res, next) {
  // 1. Check if client already sent X-Request-ID
  const incomingId = req.headers['x-request-id'];

  // 2. If present → use it | If not → generate one
  const requestId = incomingId || generateRequestId();

  // 3. Attach to req → now available everywhere
  req.requestId = requestId;

  // 4. Add to response header also
  res.setHeader('X-Request-ID', requestId);

  next();
}

module.exports = requestIdMiddleware;
