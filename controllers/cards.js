const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-errors');
const NotFoundError = require('../errors/not-found-errors');
const ForbiddenError = require('../errors/forbidden-errors');

const {
  STATUS_CREATED,
  STATUS_OK,
} = require('../utils/constants');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send({ data: cards }))
    .catch((err) => {
      throw err;
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.status(STATUS_CREATED).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Inccorrect data passed during user creation'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) { throw new NotFoundError('Card not found'); }
      // eslint-disable-next-line eqeqeq
      if (card.owner != req.user._id) { throw new ForbiddenError('You can not delete not yours cards'); }
      return card.remove();
    })
    .then(() => {
      res.status(STATUS_OK).send({ message: `Card ${cardId} has been removed` });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Request card not found');
    }
    res.status(STATUS_CREATED).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Card ID is incorrect'));
      return;
    }
    next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Request card not found');
    }
    res.status(STATUS_OK).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Card ID is incorrect'));
      return;
    }
    next(err);
  });
