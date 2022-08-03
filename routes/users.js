const routerUsers = require('express').Router();
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

routerUsers.get('/users', auth, getAllUsers);

routerUsers.get('/users/:userId', auth, getUserById);

routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateUser);

routerUsers.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), auth, updateAvatar);

routerUsers.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
}), login);

routerUsers.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
}), createUser);

routerUsers.get('/users/me', auth, getUserInfo);

module.exports = routerUsers;
