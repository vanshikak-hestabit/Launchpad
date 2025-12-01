const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
//const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");


function security(app) {
  // Security headers
  app.use(express.json({ limit: "10kb" }));

  app.use(helmet());

  // CORS
  app.use(cors({ origin: "http://127.0.0.1:5500" }));

  // Rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests" }
  });
  app.use(limiter);

  

  // Parameter pollution
  app.use(hpp());
}

module.exports = security;
