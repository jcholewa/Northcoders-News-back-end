const { Article, Comment } = require('../models');
const { commentCount } = require('../utils');

exports.getArticles = (req, res, next) => {
  Article.find()
    .then(foundArticles => {
      return Promise.all(foundArticles.map(article => {
        return article.populate('created_by')
          .execPopulate()
          .then(article => {
            return commentCount(article._id, article);
          })
      }))
    })
    .then(articles => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getOneArticle = (req, res, next) => {
  const articleID = req.params.article_id;

  Article.findById(articleID)
    .populate('created_by')
    .then(article => {
      if (!article) return Promise.reject({ status: 404, msg: `Article not found for ID: ${articleID}` });
      else {
        commentCount(articleID, article)
          .then(article => {
            res.status(200).send({ article })
          })
      }
    })
    .catch(next)
}

exports.getCommentsForArticle = (req, res, next) => {
  const articleID = req.params.article_id;
  Comment.find({ belongs_to: articleID })
    .then(comments => {
      return Promise.all(comments.map(comment => {
        return comment.populate('created_by').populate({
          path: 'belongs_to',
          select: '_id, created_by, belongs_to'
        }).execPopulate()
      }))
    })
    .then(comments => {
      res.status(200).send({ comments })
    })
    .catch(next)
}

exports.addCommentToArticle = (req, res, next) => {
  const newComment = new Comment({
    body: req.body.body,
    votes: req.body.votes,
    belongs_to: req.params.article_id,
    created_by: req.body.created_by
  })
  Comment.create(newComment)
    .then(comment => {
      return comment.populate('created_by').populate({
        path: 'belongs_to',
        select: '_id, created_by, belongs_to'
      })
        .execPopulate()
    })
    .then(comment => {
      res.status(201).send({ comment })
    })
    .catch(next)
}

exports.changeVotesOfArticle = (req, res, next) => {
  const voteToChange = req.query.vote === 'down' ? -1 : 1;
  Article.findByIdAndUpdate(req.params.article_id, { $inc: { votes: voteToChange } })
    .populate('created_by')
    .then(foundArticle => {
      console.log(foundArticle)
      if (!foundArticle) return Promise.reject({ status: 404, msg: `Article not found for ID: ${req.params.article_id}` })
      else {
        return commentCount(foundArticle._id, foundArticle)
          .then(article => {
            res.status(200).send({ article })
          })
      }
    })
    .catch(next)
}

// exports.changeVotesOfArticle = (req, res, next) => {
//   Article.findById(req.params.article_id)
//     .populate('created_by')
//     .then(foundArticle => {
//       if (!foundArticle) return Promise.reject({ status: 404, msg: `Article not found for ID: ${req.params.article_id}` });
//       else req.query.vote === 'down' ? foundArticle.votes-- : foundArticle.votes++
//       return foundArticle.save()
//         .then(article => {
//           return commentCount(article._id, article)
//         })
//         .then(article => {
//           res.status(200).send({ article })
//         })
//     })
//     .catch(next)
// }

