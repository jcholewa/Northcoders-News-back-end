const articlesRouter = require('express').Router();
const { getArticles, getOneArticle } = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles)

articlesRouter.route('/:article_id')
  .get(getOneArticle)

/*
endpoints:
GET /api/articles - done, no tests yet
GET /api/articles/:article_id
GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
PATCH /api/articles/:article_id
*/

module.exports = articlesRouter;