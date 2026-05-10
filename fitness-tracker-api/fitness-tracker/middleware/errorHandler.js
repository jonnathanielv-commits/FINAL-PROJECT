/**
 * 404 catch-all handler — must be registered AFTER all routes.
 */
function notFound(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist.`,
  });
}

/**
 * Global error handler — exactly 4 parameters required by Express.
 * Must be the LAST middleware registered.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.message,
    message: status === 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message,
  });
}

module.exports = { notFound, errorHandler };
