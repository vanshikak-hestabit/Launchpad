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

//If any route or middleware throws an error, Express sends the error here.
//if any route throws error, or you call next(err), Express automatically jumps to this middleware because it has 4 parameters(err,req,res,next)
//centralized error handling so you dont have to repeat try/catch in every route
//can format errors consistently for API responses
//like success : false, msg...