import env from '../config/env.js';

export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal server error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier provided';
  }
  // Mongoose validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }
  // Duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists`;
  }
  // Mongo unreachable / query timed out waiting on a connection
  if (err.name === 'MongooseError' && /buffering timed out/i.test(err.message)) {
    statusCode = 503;
    message = 'The database is temporarily unavailable. Please try again in a moment.';
  }
  // JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired, please log in again';
  }

  if (statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details,
    stack: env.nodeEnv === 'development' ? err.stack : undefined,
  });
}

export default errorHandler;
