const routerCards = require('express').Router();

const { getAllCards, createCard, deletCardById, likeCard, dislikeCard } = require('../controllers/cards');

routerCards.get('/cards', getAllCards);

routerCards.post('/cards', createCard);

routerCards.post('/cards/:cardId', deletCardById);

routerCards.put('/cards/:cardId/likes', likeCard);

routerCards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = routerCards;
