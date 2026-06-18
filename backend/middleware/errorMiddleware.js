// Middleware for handling 404 Route Not Found
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Centralized Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  // If headers are already sent, delegate to default express handler
  if (res.headersSent) {
    return next(err);
  }

  // Use existing status if set, otherwise default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
