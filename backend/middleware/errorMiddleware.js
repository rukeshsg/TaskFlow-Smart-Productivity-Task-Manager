const { errorResponse } = require('../utils/apiResponse');

// Centralized error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    message = `Resource not found with id: ${err.value}`;
    statusCode = 404;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  console.log(err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    statusCode = 400;
  } else if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  } else if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  console.error(`[ERROR] ${statusCode} - ${message}`, {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });


  return errorResponse(res, message, statusCode);
};

// 404 handler for unknown routes
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };
