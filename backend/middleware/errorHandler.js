function errorHandler(err, req, res, next) {
  console.error(err && err.stack ? err.stack : err);
  const message = (err && err.message) ? err.message : 'server_error';
  const status = err.status || 500;
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
