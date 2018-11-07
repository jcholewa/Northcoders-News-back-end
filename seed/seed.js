const mongoose = require('mongoose');
const {Article, Comment, Topic, User} = require('../models');
// require in any utils functions here

const seedDB = (articleData, commentData, topicData, userData) => {
  console.log('seeding the database');
  return mongoose.connection.dropDatabase()
    .then(() => {
    })
    .catch(console.log)
}

module.exports = seedDB;