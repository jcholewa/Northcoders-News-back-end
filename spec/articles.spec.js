process.env.NODE_ENV = 'test';
const app = require('../app');
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../seed/seed');

// make an index file for these (see film night for example? -- use one variable for it)
const articles = require('../seed/testData/articles.json');
const comments = require('../seed/testData/comments.json');
const topics = require('../seed/testData/topics.json');
const users = require('../seed/testData/users.json');

describe('/articles', () => {
  let userDocs, topicDocs, articleDocs, commentDocs, wrongID = mongoose.Types.ObjectId();
  beforeEach(() => {
    return seedDB({ articles, comments, topics, users }) // use 1 variable here - don't pass as an object
      .then(docs => {
        [userDocs, topicDocs, articleDocs, commentDocs] = docs;
      })
  })
  after(() => {
    return mongoose.disconnect();
  })
  it('GET returns status 200 and array of all articles', () => {
    return request
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).to.equal(articleDocs.length);
        expect(articles[0].title).to.equal(articleDocs[0].title);
      });
  });
})