import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, 'Validation Error', messages);
  }

  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ID format`);
  }

  if (err.code === 11000) {
    error = new ApiError(409, 'Duplicate field value entered');
  }

  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired');
  }

  if (err.message && err.message.includes('not allowed by CORS')) {
    error = new ApiError(403, 'Origin not allowed');
  }

  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV !== 'development'
    ? 'Internal Server Error'
    : error.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.stack || err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      errors: error.errors || [],
      stack: err.stack,
    }),
  });
};
