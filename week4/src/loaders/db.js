const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDB() {
  const uri = process.env.MONGO_URI;

  try {
    await mongoose.connect(uri);
    logger.info('Database connected');
  } catch (err) {
    logger.error('DB connection failed: ' + err.message);
    throw err;
  }
}

module.exports = connectDB;

//tries to connect to mongodb, if successful-> logs"database connected"
//if fails->logs error