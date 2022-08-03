const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getAllCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/cards', auth, getAllCards);

routerCards.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
  }),
}), createCard);

routerCards.delete('/cards/:cardId', auth, deleteCardById);

routerCards.put('/cards/:cardId/likes', auth, likeCard);

routerCards.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = routerCards;
