const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Error has occured' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'The requested user not found' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Inccorrect data passed during user creation' });
      } else {
        res.status(500).send({ message: 'Error has occured' });
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
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Invalid data passed when updating profile' });
      } else if (err.name === 'CastError') {
        res
          .status(404)
          .send({
            message: `The user with the specified id ${userId} was not found`,
          });
      } else {
        res.status(500).send({ message: 'Error has occured', err });
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Invalid data passed when updating profile' });
      } else if (err.name === 'CastError') {
        res
          .status(404)
          .send({
            message: `The user with the specified id ${userId} was not found`,
          });
      } else {
        res.status(500).send({ message: 'Error has occured', err });
      }
    });
};
