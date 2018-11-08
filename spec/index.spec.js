process.env.NODE_ENV = 'test';
const app = require('../app');
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../seed/seed');
const data = require('../seed/testData');

describe('/api', () => {
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
  describe('/articles', () => {
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
            expect(res.body.article.topic).to.equal(articleDocs[0].topic)
            expect(res.body.article.body).to.equal(articleDocs[0].body)
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
      it(`GET for an non-existent ID returns a status 404 and error message`, () => {
        return request
          .get(`/api/articles/${wrongID}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`Article not found for ID: ${wrongID}`);
          })
      })
    })
  })
  describe('/users', () => {
    describe('/users/:username', () => {
      it('GET returns status 200 and array of one user', () => {
        return request
          .get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(res => {
            expect(res.body.user.username).to.equal(userDocs[0].username)
          })
      })
      it(`GET for an non-existent ID returns a status 404 and error message`, () => {
        const wrongUserName = 1234;
        return request
          .get(`/api/users/${wrongUserName}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`User not found for username: ${wrongUserName}`);
          })
      })
    })
  })
  describe('/topics', () => {
    it('GET returns status 200 and array of all topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).to.equal(topicDocs.length);
          expect(topics[1].title).to.equal("Cats");
          expect(topics[0].slug).to.equal("mitch");
        })
    })
  })
})