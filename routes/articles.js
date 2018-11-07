const articlesRouter = require('express').Router();
const { getArticles } = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles)

/*
endpoints:
GET /api/articles - done, no tests yet
GET /api/articles/:article_id
GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
PATCH /api/articles/:article_id
*/

module.exports = articlesRouter;