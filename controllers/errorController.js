const appError = require('./../utils/appError');
const ErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message
  });
};
const handleCastDb = err => {
  message = `Invalid ${err.path}: ${err.value}`;
  return new appError(message, 400);
};
const handleExpiredTokenError = err =>
  new appError('Token expired! Please login again ', 401);

const handleTokenError = err =>
  new appError('Invalid Token! Please login again ', 401);
const handleValidationErrorDb = err => {
  const mess = Object.values(err.errors).map(el => el.message);
  message = `Invalid Input data ${mess.join('. ')}`;
  return new appError(message, 400);
};
const handleMinType = err => {
  length = err.errors.name.properties.minlength;
  message = `Tour should have min Length ${length}`;
  return new appError(message, 400);
};

const handleDuplicatekey = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  message = `Duplicate key ${value}`;
  return new appError(message, 400);
};
//
const ErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,

      message: err.message
    });
  } else {
    res.status(500).json({
      status: 'Error',
      message: 'Something Went Wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    ErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastDb(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDb(error);
    if (error.code === 11000) error = handleDuplicatekey(error);
    if (error.name === 'JsonWebTokenError') error = handleTokenError(error);
    if (error.name === 'TokenExpiredError')
      error = handleExpiredTokenError(error);
    ErrorProd(error, res);
  }
};
