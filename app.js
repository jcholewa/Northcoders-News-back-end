const express = require('express');
const app = express();
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('./config');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api')

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`);
  })
  .catch(console.log);

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({
    status: 404,
    msg: 'Page Not Found'
  })
});

app.use((err, req, res, next) => {
  // console.log('here')
  // console.log(err)
  if (err.name === 'CastError' || 'ValidationError') err.status = 400;
  res.status(err.status).send({ msg: err.message || err.msg });
  // add in default case with 500
})

module.exports = app;
