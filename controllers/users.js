const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Error has occured' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'The requested user not found' });
        return;
      };
      res.send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Id is incorrect' });
      } else {
        res.status(500).send({ message: 'Error is occured' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
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
    .then((user) => {
      if (!user) {
        res.status(400).send({ message: 'User ID is incorrect' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Invalid data passed when updating profile' });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'User ID is incorrect',
          });
      } else {
        res.status(500).send({ message: 'Error has occured' });
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
        res.status(404).send({ message: `User with id ${userId} not found` });
        return;
      };
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Invalid data passed when updating profile' });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'User ID is incorrect',
          });
      } else {
        res.status(500).send({ message: 'Error has occured' });
      }
    });
};
