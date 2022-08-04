const handleError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Error has occured'
        : message,
    });
  next();
};

module.exports = { handleError };
