const { Article } = require('../models')

exports.getArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getOneArticle = (req, res, next) => {
  const articleID = req.params.article_id;
  Article.findOne({ _id: articleID })
    .then(article => {
      res.status(200).send({ article })
    })
}

exports.getCommentsForArticle = () => {

}

exports.addCommentToArticle = () => {

}

exports.changeVotesOfArticle = () => {

}

