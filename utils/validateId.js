const mongoose = require('mongoose');

module.exports.validateId = (value, helpers) => {
  if (mongoose.isValidObjectId(value)) { return value; }
  return helpers.error('any.invalid');
};
