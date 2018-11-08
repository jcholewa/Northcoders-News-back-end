const commentsRouter = require('express').Router();
const { changeVotesOfComment, deleteComment } = require('../controllers/comments');

commentsRouter.route('/:comment_id')
  .patch(changeVotesOfComment)
  .delete(deleteComment)

module.exports = commentsRouter;