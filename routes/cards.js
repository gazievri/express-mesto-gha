const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getAllCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/cards', auth, getAllCards);

routerCards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), auth, createCard);

routerCards.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), auth, deleteCardById);

routerCards.put('/cards/:cardId/likes', auth, likeCard);

routerCards.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = routerCards;
