const topicsRouter = require('express').Router();
const { getTopics, getArticlesForTopic } = require('../controllers/topics');

topicsRouter.route('/')
  .get(getTopics)

topicsRouter.route('/:topic_slug/articles')
  .get(getArticlesForTopic)

/*
endpoints:
GET /api/topics - done, no tests yets
GET /api/topics/:topic_slug/articles
POST /api/topics/:topic_slug/articles
*/

module.exports = topicsRouter;