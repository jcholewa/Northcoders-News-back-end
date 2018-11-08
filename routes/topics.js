const topicsRouter = require('express').Router();
const { getTopics, getArticlesForTopic, addArticleToTopic } = require('../controllers/topics');

topicsRouter.route('/')
  .get(getTopics)

topicsRouter.route('/:topic_slug/articles')
  .get(getArticlesForTopic)
  .post(addArticleToTopic)

/*
endpoints:
GET /api/topics - done, no tests yets
GET /api/topics/:topic_slug/articles
POST /api/topics/:topic_slug/articles
*/

module.exports = topicsRouter;