const Card = require('../models/card');
const {
  STATUS_CREATED, STATUS_NOT_FOUND, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.status(STATUS_CREATED).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: 'Inccorrect data passed during user creation' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(STATUS_NOT_FOUND).send({ message: 'Card not found' });
        return;
      }
      if (req.user._id !== card.owner) {
        res.status(STATUS_BAD_REQUEST).send({ message: 'You can not delete not yours cards' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({ message: `Card id ${cardId} is not correct` });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(STATUS_NOT_FOUND).send({ message: 'Request card not found' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(STATUS_BAD_REQUEST).send({ message: 'Card ID is incorrect' });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      res.status(STATUS_NOT_FOUND).send({ message: 'Request card not found' });
      return;
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(STATUS_BAD_REQUEST).send({ message: 'Card ID is incorrect' });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Error has occured' });
    }
  });
