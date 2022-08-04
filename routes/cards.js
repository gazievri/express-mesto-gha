const routerCards = require('express').Router();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getAllCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const validateId = (value, helpers) => {
  if (mongoose.isValidObjectId(value)) { return value; }
  return helpers.error('any.invalid');
};

routerCards.get('/cards', auth, getAllCards);

routerCards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), auth, createCard);

routerCards.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(validateId, 'ObjectId validation'),
  }),
}), auth, deleteCardById);

routerCards.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(validateId, 'ObjectId validation'),
  }),
}), auth, likeCard);

routerCards.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom(validateId, 'ObjectId validation'),
  }),
}), auth, dislikeCard);

module.exports = routerCards;
