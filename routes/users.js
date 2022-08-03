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
routerUsers.patch('/users/me', auth, updateUser);
routerUsers.patch('/users/me/avatar', auth, updateAvatar);
routerUsers.post('/signin', login);
routerUsers.post('/signup', createUser);
routerUsers.get('/users/me', auth, getUserInfo);

module.exports = routerUsers;
