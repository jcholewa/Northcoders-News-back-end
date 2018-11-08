process.env.NODE_ENV = 'test';
const app = require('../app');
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../seed/seed');
const data = require('../seed/testData/');

describe('/users', () => {
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