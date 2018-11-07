const { Article } = require('../models')

exports.getArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.status(200).send({articles})
    })
    .catch(next)
}

exports.getOneArticle = () => {
  
}

exports.getCommentsForArticle = () => {
  
}

exports.addCommentToArticle = () => {
  
}

exports.changeVotesOfArticle = () => {

}

