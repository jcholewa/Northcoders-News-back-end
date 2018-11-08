process.env.NODE_ENV = 'test';
const app = require('../app');
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../seed/seed');
const data = require('../seed/testData/');

describe('/articles', () => {
  let userDocs, topicDocs, articleDocs, commentDocs, wrongID = mongoose.Types.ObjectId();
  beforeEach(() => {
    return seedDB(data)
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
  describe('/articles/:article_id', () => {
    it('GET returns status 200 and array of one article', () => {
      return request
        .get(`/api/articles/${articleDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article.title).to.equal(articleDocs[0].title)
        })
    })
    it('GET for an invalid ID returns a status 400 and error message', () => {
      const id = '123'
      return request
        .get(`/api/articles/${id}`)
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${id}" at path "_id" for model "articles"`);
        })
    })
  })
})