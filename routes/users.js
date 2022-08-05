const routerUsers = require('express').Router();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
} = require('../controllers/users');

const validateId = (value, helpers) => {
  if (mongoose.isValidObjectId(value)) { return value; }
  return helpers.error('any.invalid');
};

routerUsers.get('/users', auth, getAllUsers);

routerUsers.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    name: Joi.string().custom(validateId, 'ObjectId validation'),
  }),
}), auth, getUserById);

routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateUser);

routerUsers.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), auth, updateAvatar);

routerUsers.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
}), login);

routerUsers.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), createUser);

routerUsers.get('/users/me', auth, getUserInfo);

module.exports = routerUsers;
