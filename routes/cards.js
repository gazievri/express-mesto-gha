const routerCards = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getAllCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/cards', auth, getAllCards);
routerCards.post('/cards', auth, createCard);
routerCards.delete('/cards/:cardId', auth, deleteCardById);
routerCards.put('/cards/:cardId/likes', auth, likeCard);
routerCards.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = routerCards;
