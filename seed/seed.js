const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models');
const { formatTopics, formatUsers, formatArticles, createRefObj, formatComments } = require('../utils');

const seedDB = ({articleData, commentData, topicData, userData}) => {
  console.log('seeding the database');
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Promise.all([User.insertMany(formatUsers(userData)), Topic.insertMany(formatTopics(topicData))]);
    })
    .then(([userDocs, topicDocs]) => {
      const userRefObj = createRefObj(userDocs, "username");

      return Promise.all([userDocs, topicDocs, Article.insertMany(formatArticles(articleData, userRefObj))])
    })
    .then(([userDocs, topicDocs, articleDocs]) => {
      const userRefObj = createRefObj(userDocs, "username");
      const articleRefObj = createRefObj(articleDocs, "title");

      return Promise.all([userDocs, topicDocs, articleDocs, Comment.insertMany(formatComments(commentData, userRefObj, articleRefObj))])
    })
    .catch(console.log)
}

module.exports = seedDB;