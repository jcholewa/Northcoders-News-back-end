const articlesRouter = require('express').Router();

/*
endpoints:
GET /api/articles
GET /api/articles/:article_id
GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
PATCH /api/articles/:article_id
*/

module.exports = articlesRouter;