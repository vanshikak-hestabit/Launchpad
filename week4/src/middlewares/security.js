const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
//const mongoSanitize = require("express-mongo-sanitize");

const hpp = require("hpp");
const express = require("express");

function security(app) {
  // Security headers
  app.use(helmet());

  // CORS
  app.use(cors({ origin: "*" }));

  // Rate limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests" }
  });
  app.use(limiter);

  // Prevent JSON payload bombs
  app.use(express.json({ limit: "10kb" }));




  // Parameter pollution
  app.use(hpp());
}

module.exports = security;
