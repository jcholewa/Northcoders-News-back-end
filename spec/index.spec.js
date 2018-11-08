process.env.NODE_ENV = 'test';
const app = require('../app');
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../seed/seed');
const data = require('../seed/testData');
const { Article } = require('../models');

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
          // CHANGE SO NOT HARDCODED IN
          // expect(articles[0].comment_count).to.equal(2);
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
            // CHANGE THIS SO NOT HARDCODED IN
            expect(res.body.article.comment_count).to.equal(2)
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
      it('GET for an non-existent ID returns a status 404 and error message', () => {
        return request
          .get(`/api/articles/${wrongID}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`Article not found for ID: ${wrongID}`);
          })
      })
      it('PATCH returns status 204 and array containing updated article with votes minus 1', () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(200)
          .then(res => {
            expect(res.body.article.title).to.equal(articleDocs[0].title);
            expect(res.body.article.votes).to.equal(articleDocs[0].votes--);
          })
      })
      it('PATCH returns status 200 and array containing updated article with votes plus 1', () => {
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(200)
          .then(res => {
            expect(res.body.article.title).to.equal(articleDocs[0].title);
            expect(res.body.article.votes).to.equal(articleDocs[0].votes++);
          })
      })
    })
    describe('/articles/:article_id/comments', () => {
      it('GET returns status 200 and array of comments for one article', () => {
        return request
          .get(`/api/articles/${articleDocs[0]._id}/comments`)
          .expect(200)
          .then(res => {
            // CHANGE THIS SO IT's NOT HARDCODED IN
            expect(res.body.comments.length).to.equal(2);
          })
      })
      it('POST returns status 201 and array containing new comment', () => {
        const newComment = {
          body: "This is a new comment for the article",
          votes: 2,
          belongs_to: articleDocs[0]._id,
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/articles/${articleDocs[0]}/comments`)
          .send(newComment)
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment.body).to.equal(newComment.body);
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
    describe('/api/topics:topic_slug', () => {
      it('GET returns status 200 and array of all articles with defined topic slug', () => {
        let noOfArticles;

        // CHANGE THIS TO BE A FOR EACH OVER ARTICLEDOCS RATHER THAN CALLING THE DATABASE
        const countArticles = (docs) => {
          Article.count({ belongs_to: docs[1].slug })
            .then(articles => {
              noOfArticles = articles;
            })
        }
        countArticles(topicDocs)

        return request
          .get(`/api/topics/${topicDocs[1].slug}/articles`)
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).to.equal(noOfArticles);
          })
      })
      it('POST returns status 201 and array containing new article', () => {
        const newArticle = {
          title: 'New Article',
          body: 'Here is some content for the new article',
          votes: 5,
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/topics/${topicDocs[1].slug}/articles`)
          .send(newArticle)
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article.belongs_to).to.equal(topicDocs[1].slug);
            expect(article.comment_count).to.equal(0);
          })
      })
    })
  })
  describe('/comments', () => {
    it('PATCH returns status 200 and array containing updated comment with votes plus 1', () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(commentDocs[0].votes++)
        })
    })
    it('PATCH returns status 200 and array containing updated comment with votes minus 1', () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(commentDocs[0].votes--)
        })
    })
    it('DELETE returns status 200 and message confirming comment was deleted', () => {
      return request
        .delete(`/api/comments/${commentDocs[0]._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.message).to.equal('comment deleted')
        })
    })
  })
})