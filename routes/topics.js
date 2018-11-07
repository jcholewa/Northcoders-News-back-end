const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics');

topicsRouter.route('/')
  .get(getTopics)

/*
endpoints:
GET /api/topics - done, no tests yets
GET /api/topics/:topic_slug/articles
POST /api/topics/:topic_slug/articles
*/

module.exports = topicsRouter;