const seedDB = require('./seedDB');
const mongoose = require('mongoose');
const { DB_URL } = require('../config');
// require in raw data files here - ternary on whether process.env.NODE_ENV === 'test' or not:
// const {data, data, data} = process.env.NODE_ENV === 'test' ? require('..seeds/testdata/index or whatever) : require(dev data file path)

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}`)
    return seedDB() // feed in raw data here
  })
  .then(() => {
    mongoose.disconnect();
  })
  .then(() => {
    console.log('successfully disconnected');
  })
  .catch(console.log)