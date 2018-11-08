const topicsRouter = require('express').Router();
const { getTopics, getArticlesForTopic, addArticleToTopic } = require('../controllers/topics');

topicsRouter.route('/')
  .get(getTopics)

topicsRouter.route('/:topic_slug/articles')
  .get(getArticlesForTopic)
  .post(addArticleToTopic)

module.exports = topicsRouter;