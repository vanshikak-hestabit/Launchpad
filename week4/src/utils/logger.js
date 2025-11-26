const { createLogger, format, transports } = require('winston');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),           // Logs to terminal
    new transports.File({ filename: logFile }) // Logs to logs/app.log
  ],
});

module.exports = logger;

//shows logs on console,saves logs inside a file automatically