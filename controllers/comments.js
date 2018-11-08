const { Comment } = require('../models');

exports.changeVotesOfComment = (req, res, next) => {
  Comment.findById(req.params.comment_id)
    .then(foundComment => {
      if (req.query.vote === 'down') {
        foundComment.set({ vote: foundComment.vote-- })
        return foundComment.save()
      } else if (req.query.vote === 'up') {
        foundComment.set({ vote: foundComment.vote++ })
        return foundComment.save()
      }
    })
    .then(comment => {
      res.status(200).send({ comment })
    })
}

exports.deleteComment = (req, res, next) => {
  Comment.findOneAndRemove({ id: req.params.comment_id })
    .then(comment => {
      res.status(200).send({ message: 'comment deleted' })
    })
}