const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = require('../config');
const data = require('./devData/index');

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`)
    return seedDB(data)
  })
  .then(([userDocs, topicDocs, articleDocs, commentDocs]) => {
    // console.log(userDocs)
    mongoose.disconnect();
  })
  .then(() => {
    console.log('successfully disconnected');
  })
  .catch(console.log)