const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");


function security(app) {
  
  //payload size limit: User cannot send more than 10kb of JSON.
  app.use(express.json({ limit: "10kb" }));

  // Security headers: XSS protection,Clickjacking, protection,Hide server info
  app.use(helmet());

  // CORS: allows only this frontend to access API
  app.use(cors({ origin: "http://127.0.0.1:5500" }));

  // Rate limiter: Same IP can only send 100 requests in 15 minutes.
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests" }
  });
  app.use(limiter);

  // Parameter pollution: ignores multiple values in same entry(/api?role=admin&role=user)
  app.use(hpp());
}

module.exports = security;
