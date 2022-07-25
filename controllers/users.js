const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({}).then((user) => res.send({ data: user }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id).then((user) => res.send({ data: user }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Error was occured' }));
};
