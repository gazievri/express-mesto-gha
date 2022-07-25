// const Card = require('../models/card');

// module.exports.getAllCards = (req, res) => {
//   Card.find({}).then((cards) => res.send({ data: cards }));
// };

// module.exports.deletCardById = (req, res) => {
//   Card.findByIdAndRemove(req.params.id).then((user) => res.send({ data: user }));
// };

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };


// module.exports.createUser = (req, res) => {
//   const { name, about, avatar } = req.body;

//   User.create({ name, about, avatar })
//     .then((user) => res.send({ data: user }))
//     .catch((err) => res.status(500).send({ message: 'Error was occured' }));
// };