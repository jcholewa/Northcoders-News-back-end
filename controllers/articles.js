const { Article, Comment, User } = require('../models')

exports.getArticles = (req, res, next) => {
  let count = 0;
  let articles = [];
  Article.find()
    .then(articles => {
      res.status(200).send({ articles })
    })
    // Article.find()
    //   .then(foundArticles => {
    //     foundArticles.map(article => {
    //       Comment.count({ belongs_to: article._id })
    //         .then(comments => {
    //           article = article.toJSON()
    //           article["comment_count"] = comments;
    //           foundArticles.push(article)
    //           count++;
    //           if (count === foundArticles.length) {
    //             // console.log(articles)
    //             res.status(200).send({ foundArticles})
    //           }
    //         })

    //     })

    //   })
    .catch(next)
}

exports.getOneArticle = (req, res, next) => {
  const articleID = req.params.article_id;

  Article.findById(articleID)
    .populate('created_by')
    .then(article => {
      if (!article) return Promise.reject({ status: 404, msg: `Article not found for ID: ${articleID}` });
      else {
        Comment.count({ belongs_to: articleID })
          .then(comments => {
            article = article.toJSON()
            article["comment_count"] = comments;
            res.status(200).send({ article })
          })
      }
    })
    .catch(next)
}

exports.getCommentsForArticle = (req, res, next) => {
  const articleID = req.params.article_id;
  Comment.find({ belongs_to: articleID })
    // .populate('created_by')
    // .populate('belongs_to')
    .then(comments => {
      // console.log(comments)
      res.status(200).send({ comments })
    })
    .catch(next)
}

exports.addCommentToArticle = (req, res, next) => {
  const newComment = new Comment({
    body: req.body.body,
    votes: req.body.votes,
    belongs_to: req.body.belongs_to,
    created_by: req.body.created_by
  })
  newComment.populate('created_by')
    .populate('belongs_to').execPopulate()
    .then(comment => {
      // if (!comment.created_by || !comment.belongs_to) {
      //   return Promise.reject({ status: 404, msg: `Article not found for ID: ${articleID}` });
      // } else {
      res.status(201).send({ comment })
      // }
    })
    .catch(next)
}

exports.changeVotesOfArticle = (req, res, next) => {
  Article.findById(req.params.article_id)
    .populate('created_by')
    .then(foundArticle => {
      if (!foundArticle) return Promise.reject({ status: 404, msg: `Article not found for ID: ${req.params.article_id}` });
      else {
        if (req.query.vote === 'down') {
          foundArticle.set({ vote: foundArticle.vote-- })
          return foundArticle.save()
        } else if (req.query.vote === 'up') {
          foundArticle.set({ vote: foundArticle.vote++ })
          return foundArticle.save()
        }
      }
    })
    .then(article => {
      res.status(200).send({ article })
    })
    .catch(next)
}

