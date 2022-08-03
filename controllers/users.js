const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  STATUS_CREATED,
  STATUS_NOT_FOUND,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_UNAUTHORIZED_ERROR,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(STATUS_NOT_FOUND).send({ message: 'The requested user not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Id is incorrect' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error is occured' });
      }
    });
};

module.exports.createUser = (req, res) => {
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
        res.status(STATUS_BAD_REQUEST).send({ message: `User email ${email} is not real email` });
        return;
      }
      res.status(STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Inccorrect data passed during user creation' });
      } else if (err.name === 'MongoServerError') {
        res.status(STATUS_BAD_REQUEST).send({ message: `User with email ${email} already exist` });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
      }
    });
};

module.exports.updateUser = (req, res) => {
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
        res.status(STATUS_NOT_FOUND).send({ message: `User ID ${userId} is not found` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data passed when updating profile' });
      } else if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({
            message: 'User ID is incorrect',
          });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
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
        res.status(STATUS_NOT_FOUND).send({ message: `User with id ${userId} not found` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data passed when updating profile' });
      } else if (err.name === 'CastError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({
            message: 'User ID is incorrect',
          });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(STATUS_OK).cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
    })
    .catch((err) => {
      res
        .status(STATUS_UNAUTHORIZED_ERROR)
        .send({ message: err.message });
    });
};

module.exports.getUserInfo = (req, res) => {
  const { _id } = req.user;

  User.find({ _id })
    .then((user) => res.status(STATUS_OK).send({ user }))
    .catch(() => res.status(STATUS_UNAUTHORIZED_ERROR).send({ message: 'Authorization is needed' }));
};
