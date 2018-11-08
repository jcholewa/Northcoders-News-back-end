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

module.exports = articlesRouter;