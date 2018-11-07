const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models');
const { formatTopics, formatUsers, formatArticles, createRefObj } = require('../utils')
// require in any utils functions here

const seedDB = (articleData, commentData, topicData, userData) => {
  console.log('seeding the database');
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Promise.all([User.insertMany(formatUsers(userData)), Topic.insertMany(formatTopics(topicData))]);
    })
    .then(([userDocs, topicDocs]) => {
      const userRefObj = createRefObj(userDocs)

      return Promise.all([userDocs, topicDocs,Article.insertMany(formatArticles(articleData, userRefObj))])

    })
    .then(([userDocs, topicDocs, articleDocs]) => {
    })
    .catch(console.log)
}

module.exports = seedDB;