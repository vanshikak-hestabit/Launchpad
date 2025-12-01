const express = require('express');
const productRouter = require('./src/routes/product');
const sampleRouter = require('./src/routes/sample');
const userRouter = require('./src/routes/user');
const { loadEnv } = require('./src/config');
const logger = require('./src/utils/logger');
const connectDB = require('./src/loaders/db');
const security = require('./src/middlewares/security');
const sanitize = require('./src/middlewares/sanitize');   
const errorHandler = require('./src/middlewares/error.middleware');
const tracing = require('./src/utils/tracing');
const requestId = require('./src/middlewares/requestId');

loadEnv();
logger.info('Env loaded');

async function start() {
  try {
    await connectDB();

    const app = express();


    //app.use(express.json({ limit: "10kb" }));
    app.use(express.urlencoded({limit:"10kb" , extended :true}))

    

    // 1️⃣ Apply core middlewares
     security(app); 
     app.use(sanitize)          // helmet, cors, rateLimit etc.

    app.use(requestId);

    // 2️⃣ Mount routes
    app.use('/api', sampleRouter);
    app.use('/api/user', userRouter);
    app.use('/api/products', productRouter);

    // 3️⃣ Global error handler
    app.use(errorHandler);

    const port = process.env.PORT || 3000;
    app.listen(port, () => logger.info(`Server started at port ${port}`));
  } catch (err) {
    logger.error('Startup failed: ' + err.message);
  }
}

start();
