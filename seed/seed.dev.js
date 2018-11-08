const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = require('../config');
const articles = require('../seed/devData/articles.json');
const comments = require('../seed/devData/comments.json');
const topics = require('../seed/devData/topics.json');
const users = require('../seed/devData/users.json');

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`)
    return seedDB({ articles, comments, topics, users })
  })
  .then(([userDocs, topicDocs, articleDocs, commentDocs]) => {
    // console.log(articleDocs)
    mongoose.disconnect();
  })
  .then(() => {
    console.log('successfully disconnected');
  })
  .catch(console.log)