const { User } = require('../models');
const { Article } = require('../models');
const { commentCount } = require('../utils');

exports.getOneUser = (req, res, next) => {
  const userName = req.params.username
  User.findOne({ username: userName })
    .then(user => {
      if (!user) return Promise.reject({ status: 404, msg: `User not found for username: ${userName}` });
      res.status(200).send({ user })
    })
    .catch(next)
}

exports.getArticlesForUser = (req, res, next) => {
  const userName = req.params.username;
  User.findOne({ username: userName })
    .then(user => {
      Article.find({ created_by: user._id })
        .then(articles => {
          if (!articles) {
            return Promise.reject({ status: 404, msg: `Articles not found for user: ${userName}` });
          } else {
            Promise.all(articles.map(article => {
              return article.populate('created_by').execPopulate()
                .then(article => {
                  return commentCount(article._id, article)
                })
            }))
              .then(articles => {
                res.status(200).send({ articles });
              })

          }
        })
    })
    .catch(next)
}