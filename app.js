const express = require('express');
const app = express();
const mongoose = require('mongoose');
const DB_URL = require('./config');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api')

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`);
  })
  .catch(console.log);

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (err.name === 'CastError') err.status = 400;
  res.status(err.status).send({ msg: err.message || err.msg });
})

module.exports = app;
