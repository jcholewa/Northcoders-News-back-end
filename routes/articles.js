const articlesRouter = require('express').Router();
const { getArticles, getOneArticle, getCommentsForArticle, addCommentToArticle, changeVotesOfArticle } = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles)

articlesRouter.route('/:article_id')
  .get(getOneArticle)
  .patch(changeVotesOfArticle)

articlesRouter.route('/:article_id/comments')
  .get(getCommentsForArticle)
  .post(addCommentToArticle)

/*
endpoints:
GET /api/articles - done, no tests yet
GET /api/articles/:article_id
GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
PATCH /api/articles/:article_id
*/

module.exports = articlesRouter;