const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const InternalServerError = require('../errors/internal-server-errors');
const BadRequestError = require('../errors/bad-request-errors');
const EmailExistError = require('../errors/email-exist-errors');
const NotFoundError = require('../errors/not-found-errors');
const UnauthorizedError = require('../errors/unauthorized-errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  STATUS_CREATED,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new InternalServerError('Error has occured');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('The requested user not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Id is incorrect');
      } else {
        throw new InternalServerError('Error has occured');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  const emailIsValid = validator.isEmail(email);

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      if (!emailIsValid) {
        throw new BadRequestError(`User email ${email} is not real email`);
      }
      res.status(STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Inccorrect data passed during user creation');
      } else if (err.code === 11000) {
        throw new EmailExistError(`User with email ${email} already exist`);
      } else {
        throw new InternalServerError('Error has occured');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User ID ${userId} is not found`);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Invalid data passed when updating profile');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('User ID is incorrect');
      } else {
        throw new InternalServerError('Error has occured');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`User with id ${userId} not found`);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Invalid data passed when updating profile');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('User ID is incorrect');
      } else {
        throw new InternalServerError('Error has occured');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(STATUS_OK).cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res) => {
  const { _id } = req.user;

  User.find({ _id })
    .then((user) => res.status(STATUS_OK).send({ user }))
    .catch(() => {
      throw new UnauthorizedError('Authorization is needed');
    });
};
