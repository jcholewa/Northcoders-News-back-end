process.env.NODE_ENV = 'test';
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const request = supertest(app);
const seedDB = require('../seed/seed');

const articles = ('../seed/testData/articles.json');
const comments = ('../seed/testData/comments.json');
const topics = ('../seed/testData/topics.json');
const users = ('../seed/testData/users.json');

describe('/articles', () => {
  let testData;
  beforeEach(() => {
    return seedDB(articles, comments, topics, users)
      .then(([userDocs, topicDocs, articleDocs, commentDocs]) => {
        testData = userDocs, topicDocs, articleDocs, commentDocs;
      })
  })
})