const express = require('express');
const logger = require('../utils/logger');
const connectDB = require('./db');
const errorHandler = require('../middlewares/error.middleware'); 

async function loadApp({ routes = [], middlewares = [] } = {}) {
  const app = express();

  // Load middlewares
  middlewares.forEach((mw) => app.use(mw));
  logger.info('Middlewares loaded: ' + middlewares.length);

  // Load DB
  await connectDB();

  // Load routes
  let count = 0;
  routes.forEach((r) => {
    app.use(r.path, r.router);
    count++;
  });
  logger.info('Routes mounted: ' + count);

   app.use(errorHandler);

  return app;
}

module.exports = loadApp;

//this is app loader
// creates an express app, loads middleware, loads routes,
//tells how many middlewares and routes were mounted
