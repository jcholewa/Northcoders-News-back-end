const seedDB = require('./seed');
const mongoose = require('mongoose');
const { DB_URL } = require('../config');
const articles =
  process.env.NODE_ENV === "test" ? require('../seed/testData/articles.json') : require('../seed/devData/articles.json');
const comments =
  process.env.NODE_ENV === "test" ? require('../seed/testData/comments.json') : require('../seed/devData/comments.json');
const topics =
  process.env.NODE_ENV === "test" ? require('../seed/testData/topics.json') : require('../seed/devData/topics.json');
const users =
  process.env.NODE_ENV === "test" ? require('../seed/testData/users.json') : require('../seed/devData/users.json');

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`)
    return seedDB(articles, comments, topics, users)
  })
  .then(() => {
    mongoose.disconnect();
  })
  .then(() => {
    console.log('successfully disconnected');
  })
  .catch(console.log)