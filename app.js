const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/users');
const routerCards = require('./routes/cards');
const { STATUS_NOT_FOUND } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
// app.use(express.json()) - парсинг запросов встроенными методом express без подключения bodyParser

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62decd338fe6a082a601ac3b',
  };

  next();
});

// app.use((req, res, next) => {
//   console.log(`${req.method}: ${req.path}`);
//   next();
// });

app.use(router);
app.use(routerCards);
app.all('/*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Requested path not found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
