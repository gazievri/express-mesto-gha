const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const { STATUS_UNAUTHORIZED_ERROR } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWIth('Bearer ')) {
    return res.status(STATUS_UNAUTHORIZED_ERROR).send({ message: 'Authorization is needed' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res.status(STATUS_UNAUTHORIZED_ERROR).send({ message: 'Authorization is needed' });
  }

  req.user = payload;
  next();
};
