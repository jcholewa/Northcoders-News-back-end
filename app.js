const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { DB_URL } = require('./config');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api')

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`);
  })
  .catch(console.log);

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use((error, req, res, next) => {
  console.log(error);
})

module.exports = app;
