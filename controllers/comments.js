const { Comment } = require('../models');

exports.changeVotesOfComment = (req, res, next) => {
  Comment.findById(req.params.comment_id)
    .populate('created_by')
    .populate({
      path: 'belongs_to',
      select: '_id, created_by, belongs_to'
    })
    .then(foundComment => {
      if (!foundComment) return Promise.reject({ status: 404, msg: `Comment not found for ID: ${req.params.comment_id}` });

      req.query.vote === 'down' ? foundComment.votes-- : foundComment.votes++
      return foundComment.save()
    })
    .then(comment => {
      res.status(200).send({ comment })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
  Comment.findByIdAndRemove({ _id: req.params.comment_id })
    .then((comment) => {
      if (!comment) return Promise.reject({ status: 404, msg: `Delete failed: comment not found for ID: ${req.params.comment_id}` });

      res.status(200).send({ message: 'comment deleted' })

    })
    .catch(next)
}