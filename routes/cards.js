const routerCards = require('express').Router();

const {
  getAllCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.get('/cards', getAllCards);
routerCards.post('/cards', createCard);
routerCards.delete('/cards/:cardId', deleteCardById);
routerCards.put('/cards/:cardId/likes', likeCard);
routerCards.delete('/cards/:cardId/likes', dislikeCard);
// routerCards.all('/*', (req, res) => {
//   res.status(404).send({ message: 'Many tests' });
// });

module.exports = routerCards;
