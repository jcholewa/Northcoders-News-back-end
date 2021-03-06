const express = require('express');
const app = express();
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('./config');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const cors = require('cors')

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`);
  })
  .catch(console.log);

app.use(bodyParser.json());

app.use(cors())

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({
    status: 404,
    msg: 'Page Not Found'
  })
});

app.use((err, req, res, next) => {
  if (err.name === 'CastError') err.status = 400, err.message = 'Invalid ID; please enter correct ID';
  if (err.name === 'ValidationError') err.status = 400;
  res.status(err.status).send({ msg: err.message || err.msg });
})

module.exports = app;
