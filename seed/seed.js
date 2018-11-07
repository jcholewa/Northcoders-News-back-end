const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models');
const { formatTopics } = require('../utils')
// require in any utils functions here

const seedDB = (articleData, commentData, topicData, userData) => {
  console.log('seeding the database');
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Topic.insertMany(formatTopics(topicData));
    })
    .then((formattedTopicData) => {
      console.log(formattedTopicData)
    })
    .catch(console.log)
}

module.exports = seedDB;