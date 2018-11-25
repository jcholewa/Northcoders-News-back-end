process.env.NODE_ENV = 'test';
const app = require('../app');
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose');
const { expect } = require('chai');
const seedDB = require('../seed/seed');
const data = require('../seed/testData');
const chai = require('chai');
const asserttype = require('chai-asserttype');
const { createDocsRefObj } = require('../utils');
chai.use(asserttype);

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
  it('GET for a non-existent path returns status 404 and error message', () => {
    return request
      .get(`/api/artices`)
      .expect(404)
      .then(res => {
        expect(res.body.msg).to.equal('Page Not Found')
      })
  })
  describe('/articles', () => {
    it('GET returns status 200 and array of all articles (getArticles)', () => {
      const commentRefObj = createDocsRefObj(commentDocs);
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).to.equal(articleDocs.length);
          expect(articles[0].title).to.equal(articleDocs[0].title);
          expect(articles[0].comment_count).to.equal(commentRefObj[articleDocs[0]._id]);
          expect(articles[1].comment_count).to.equal(commentRefObj[articleDocs[1]._id]);
          expect(articles[0].created_by).to.be.object();
        });
    });
    describe('/articles/:article_id', () => {
      it('GET returns status 200 and array of one article, (getOneArticle)', () => {
        const commentRefObj = createDocsRefObj(commentDocs);
        return request
          .get(`/api/articles/${articleDocs[0]._id}`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.title).to.equal(articleDocs[0].title)
            expect(article.topic).to.equal(articleDocs[0].topic)
            expect(article.body).to.equal(articleDocs[0].body)
            expect(article.comment_count).to.equal(commentRefObj[articleDocs[0]._id]);
          })
      })
      it('GET for an invalid ID returns a status 400 and error message, (getOneArticle)', () => {
        const id = '123'
        return request
          .get(`/api/articles/${id}`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(`Cast to ObjectId failed for value "${id}" at path "_id" for model "articles"`);
          })
      })
      it('GET for an non-existent ID returns a status 404 and error message (getOneArticle)', () => {
        return request
          .get(`/api/articles/${wrongID}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(`Article not found for ID: ${wrongID}`);
          })
      })
      it('PATCH returns status 204 and array containing updated article with votes minus 1, (changeVotesOfArticle)', () => {
        const commentRefObj = createDocsRefObj(commentDocs);
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.title).to.equal(articleDocs[0].title);
            expect(article.votes).to.equal(articleDocs[0].votes - 1);
            expect(article.comment_count).to.equal(commentRefObj[articleDocs[0]._id]);
          })
      })
      it('PATCH returns status 200 and array containing updated article with votes plus 1, (changeVotesOfArticle)', () => {
        const commentRefObj = createDocsRefObj(commentDocs);
        return request
          .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.title).to.equal(articleDocs[0].title);
            expect(article.votes).to.equal(articleDocs[0].votes + 1);
            expect(article.comment_count).to.equal(commentRefObj[articleDocs[0]._id])
          })
      })
      it('PATCH for an invalid ID returns a status 400 and error message, (changeVotesOfArticle)', () => {
        const id = '123'
        return request
          .patch(`/api/articles/${id}?vote=up`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(`Cast to ObjectId failed for value "${id}" at path "_id" for model "articles"`);
          })
      })
      it('PATCH for a non-existent ID returns a status 404 and error message, (changeVotesOfArticle)', () => {
        return request
          .patch(`/api/articles/${wrongID}?vote=up`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(`Article not found for ID: ${wrongID}`);
          })
      })
    })
    describe('/articles/:article_id/comments', () => {
      it('GET returns status 200 and array of comments for one article, (getCommentsForArticle)', () => {
        const commentRefObj = createDocsRefObj(commentDocs);
        return request
          .get(`/api/articles/${articleDocs[0]._id}/comments`)
          .expect(200)
          .then(({ body: { comments } }) => {
            console.log(comments)
            expect(comments.length).to.equal(commentRefObj[articleDocs[0]._id]);
            expect(comments[0].created_by).to.be.object();
            expect(comments[1].belongs_to).to.be.object();
            // console.log(comments[0].belongs_to._id)
            // console.log(articleDocs[0]._id)
            // expect(comments[0].belongs_to._id).to.equal(articleDocs[0]._id);
          })
      })
      it('GET for an invalid article ID returns a status 400 and error message, (getCommentsForArticle)', () => {
        const id = '123'
        return request
          .get(`/api/articles/${id}/comments`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${id}" at path "belongs_to" for model "comments"`);
          })
      })
      it('GET for a non-existent ID returns a status 404 and error message, (getCommentsForArticle)', () => {
        return request
          .get(`/api/articles/${wrongID}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`Article not found for ID: ${wrongID}`);
          })
      })
      it('POST returns status 201 and array containing new comment, (addCommentToArticle)', () => {
        const newComment = {
          body: "This is a new comment for the article",
          votes: 2,
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newComment)
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment.body).to.equal(newComment.body);
            expect(comment.created_by.username).to.equal(userDocs[0].username)
            expect(comment.created_by).to.be.object();
            expect(comment.belongs_to).to.be.object();
          })
      })
      it('POST for invalid comment body returns status 400 and error message, (addCommentToArticle)', () => {
        const newComment = {
          body: { test: 'testy test test' },
          votes: 2,
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newComment)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('comments validation failed: body: Cast to String failed for value "{ test: \'testy test test\' }" at path "body"')
          })
      })
      it('POST for invalid comment votes returns status 400 and error message, (addCommentToArticle)', () => {
        const newComment = {
          body: 'This is a new comment for the article',
          votes: 'hello',
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newComment)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('comments validation failed: votes: Cast to Number failed for value "hello" at path "votes"');
          })
      })
      it('POST for invalid comment created_by user ID returns status 400 and error message, (addCommentToArticle)', () => {
        const newComment = {
          body: 'This is a new comment for the article',
          votes: 2,
          created_by: 1234
        }
        return request
          .post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(newComment)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('comments validation failed: created_by: Cast to ObjectID failed for value "1234" at path "created_by"');
          })
      })
      it('POST for an invalid article ID returns a status 400 and error message, (addCommentToArticle)', () => {
        const id = '123'
        const newComment = {
          body: "This is a new comment for the article",
          votes: 2,
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/articles/${id}/comments`)
          .send(newComment)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`comments validation failed: belongs_to: Cast to ObjectID failed for value "123" at path "belongs_to"`);
          })
      })
    })
  })
  describe('/topics', () => {
    it('GET returns status 200 and array of all topics, (getTopics)', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).to.equal(topicDocs.length);
          expect(topics[1].title).to.equal(topicDocs[1].title);
          expect(topics[0].slug).to.equal(topicDocs[0].slug);
        })
    })
    describe('/api/topics/:topic_slug/articles', () => {
      it('GET returns status 200 and array of all articles with defined topic slug, (getArticlesForTopic)', () => {
        const articleRefObj = createDocsRefObj(articleDocs)
        const commentRefObj = createDocsRefObj(commentDocs);
        return request
          .get(`/api/topics/${topicDocs[1].slug}/articles`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(articleRefObj[topicDocs[1].slug]);
            expect(articles[1].created_by).to.be.object();
            expect(articles[0].comment_count).to.equal(commentRefObj[articleDocs[0]._id]);
          })
      })
      it('GET for a non-existent topic returns a status 404 and error message, (getArticlesForTopic)', () => {
        const nonexistentTopic = 'hello'
        return request
          .patch(`/api/topics/${nonexistentTopic}/articles`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(`Page Not Found`);
          })
      })
      it('POST returns status 201 and array containing new article, (addArticleToTopic)', () => {
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
            expect(article.created_by).to.be.object();
          })
      })
      it('POST for invalid article body returns status 400 and error message, (addArticleToTopic)', () => {
        const newArticle = {
          title: 'New Article',
          body: { writing: 'Here is some content for the new article' },
          votes: 5,
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/topics/${topicDocs[1].slug}/articles`)
          .send(newArticle)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('articles validation failed: body: Cast to String failed for value "{ writing: \'Here is some content for the new article\' }" at path "body"');
          })
      })
      it('POST for invalid article title returns status 400 and error message, (addArticleToTopic)', () => {
        const newArticle = {
          title: { title: 'Heading' },
          body: 'Here is some content for the new article',
          votes: 5,
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/topics/${topicDocs[1].slug}/articles`)
          .send(newArticle)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('articles validation failed: title: Cast to String failed for value "{ title: \'Heading\' }" at path "title"');
          })
      })
      it('POST for invalid article votes returns status 400 and error message, (addArticleToTopic)', () => {
        const newArticle = {
          title: 'New Article',
          body: 'Here is some content for the new article',
          votes: 'hello',
          created_by: userDocs[0]._id
        }
        return request
          .post(`/api/topics/${topicDocs[1].slug}/articles`)
          .send(newArticle)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('articles validation failed: votes: Cast to Number failed for value "hello" at path "votes"');
          })
      })
      it('POST for invalid article created_by user ID returns status 400 and error message, (addArticleToTopic)', () => {
        const newArticle = {
          title: 'New Article',
          body: 'Here is some content for the new article',
          votes: 5,
          created_by: 1234,
        }
        return request
          .post(`/api/topics/${topicDocs[1].slug}/articles`)
          .send(newArticle)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('articles validation failed: created_by: Cast to ObjectID failed for value "1234" at path "created_by"');
          })
      })
    })
  })
  describe('/comments', () => {
    it('PATCH returns status 200 and array containing updated comment with votes plus 1, (changeVotesOfComment)', () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(commentDocs[0].votes + 1)
        })
    })
    it('PATCH returns status 200 and array containing updated comment with votes minus 1, (changeVotesOfComment)', () => {
      return request
        .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(commentDocs[0].votes - 1)
        })
    })
    it('PATCH for an invalid ID returns a status 400 and error message, (changeVotesOfComment)', () => {
      const id = '123'
      return request
        .patch(`/api/comments/${id}?vote=up`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(`Cast to ObjectId failed for value "${id}" at path "_id" for model "comments"`);
        })
    })
    it('PATCH for a non-existent ID returns a status 404 and error message, (changeVotesOfComment)', () => {
      return request
        .patch(`/api/comments/${wrongID}?vote=up`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(`Comment not found for ID: ${wrongID}`);
        })
    })
    it('DELETE returns status 200 and message confirming comment was deleted, (deleteComment)', () => {
      return request
        .delete(`/api/comments/${commentDocs[0]._id}`)
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).to.equal('comment deleted')
        })
    })
    it('DELETE for a non-existent ID returns a status 404 and error message, (deleteComment)', () => {
      return request
        .delete(`/api/comments/${wrongID}`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(`Delete failed: comment not found for ID: ${wrongID}`);
        })
    })
  })
  describe('/users', () => {
    describe('/users/:username, (getOneUser)', () => {
      it('GET returns status 200 and array of one user', () => {
        return request
          .get(`/api/users/${userDocs[0].username}`)
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user.username).to.equal(userDocs[0].username);
            expect(user.name).to.equal(userDocs[0].name);
            expect(user.avatar_url).to.equal(userDocs[0].avatar_url)
          })
      })
      it(`GET for an non-existent username returns a status 404 and error message, (getOneUser)`, () => {
        const wrongUserName = 1234;
        return request
          .get(`/api/users/${wrongUserName}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(`User not found for username: ${wrongUserName}`);
          })
      })
    })
  })
})