function errorHandler(err, req, res,next) {
  console.error(err); // log the error to console or file

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
}

module.exports = errorHandler;

//centralized error handling so you dont have to repeat try/catch in every route
//can format errors consistently for API responses
//like success : false, msg...