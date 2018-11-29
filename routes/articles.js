const articlesRouter = require('express').Router();
const { getArticles, getOneArticle, getCommentsForArticle, addCommentToArticle, changeVotesOfArticle, deleteArticle } = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles)

articlesRouter.route('/:article_id')
  .get(getOneArticle)
  .patch(changeVotesOfArticle)
  .delete(deleteArticle)

articlesRouter.route('/:article_id/comments')
  .get(getCommentsForArticle)
  .post(addCommentToArticle)

module.exports = articlesRouter;