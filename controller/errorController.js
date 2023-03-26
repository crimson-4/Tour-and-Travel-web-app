const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  // console.log(err);

  const message = `Duplicate field value "${err.keyValue.name}" .Please use another value`;

  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) => {
  return new AppError('Invalid token.Please log in again', 401);
};

const handleJWTExpiredError = (err) => {
  return new AppError('Your token has expired!.Please log in again', 401);
};

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  //RENDERED WEBSITE
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    //Operational error

    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //programming error

    // Log Error
    console.error('ERROR', err);
    // Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  if (err.isOperational) {
    console.log('website');
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err?.message,
    });
  }
  //programming error

  // Log Error
  //console.error('ERROR', err);
  // Send generic message
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'please try again later',
  });
};
//console.log(typeof process.env.NODE_ENV, typeof 'p');
//console.log('error happened');
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    //console.log('hi.............................', err.name);
    console.log('development error');
    sendErrorDev(err, req, res);
  } else {
    console.log('prod bro', err.message);
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message;
    //console.log('error h', error);
    // console.log('hi prod.............................', err);
    // console.log('hi.............................', error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code == 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(error, req, res);
  }
  next();
};
