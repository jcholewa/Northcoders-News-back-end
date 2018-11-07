process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const seedDB = require('../seed/seed');

const articles = require('../seed/testData/articles.json');
const comments = require('../seed/testData/comments.json');
const topics = require('../seed/testData/topics.json');
const users = require('../seed/testData/users.json');

describe('/articles', () => {
  let testData;
  beforeEach(() => {
    return seedDB(articles, comments, topics, users)
      .then(([userDocs, topicDocs, articleDocs, commentDocs]) => {
        testData = [userDocs, topicDocs, articleDocs, commentDocs];
      })
  })
  it('GET status 200 array of all articles', () => {
    return request
      .get('/articles')
      .expect(200)
      .then(res => {
        expect(res.body.articles.length).to.equal(4);
      });
  });
})