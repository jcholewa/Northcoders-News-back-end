const express = require('express');
const app = express();
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('./config');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const path = require('path');

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`);
  })
  .catch(console.log);

app.use(bodyParser.json());

app.use('/api', (req,res, next) => {
  res.status(200).sendFile( `${process.env.PWD}/index.html`)
})

app.use('/*', (req, res, next) => {
  next({
    status: 404,
    msg: 'Page Not Found'
  })
});

app.use((err, req, res, next) => {
  if (err.name === 'CastError') err.status = 400;
  if (err.name === 'ValidationError') err.status = 400;
  res.status(err.status).send({ msg: err.message || err.msg });
})

module.exports = app;
