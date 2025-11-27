const productRouter = require('./src/routes/product');
const express = require('express'); 
const { loadEnv } = require('./src/config');
const logger = require('./src/utils/logger');
const connectDB = require('./src/loaders/db');
const createApp = require('./src/loaders/app');
//const mainRouter = require('./src/routes/index');
const sampleRouter = require('./src/routes/sample');
const userRouter = require('./src/routes/user');

const loadedFile = loadEnv();
logger.info('Loaded env file: ' + loadedFile);

async function start() {
  try {
    await connectDB();  //config/db.js

    const app = await createApp({
      middlewares: [express.json()],
      routes: [
        { path: '/api', router: sampleRouter },
       //  { path: '/', router: mainRouter },
        { path: '/api/user', router: userRouter },
        { path: '/api/products', router: productRouter }
      ]
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      logger.info('Server started at port ' + port);
    });

  } catch (err) {
    logger.error('Startup failed: ' + err.message);
  }
}

start();

//loads env files, calles dbloader and apploader, starts server
