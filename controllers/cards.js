const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({}).then((cards) => res.send({ data: cards }));
  console.log(req.user._id);
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Error was occured' }));
};

module.exports.deletCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id).then((cards) => res.send({ data: cards }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
);

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
);
