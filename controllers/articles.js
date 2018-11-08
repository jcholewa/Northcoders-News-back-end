const { Article, Comment } = require('../models')

exports.getArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getOneArticle = (req, res, next) => {
  const articleID = req.params.article_id;
  Article.findById(articleID)
    .then(article => {
      if (!article) return Promise.reject({ status: 404, msg: `Article not found for ID: ${articleID}` });
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.getCommentsForArticle = (req, res, next) => {
  const articleID = req.params.article_id;
  Comment.find({ belongs_to: articleID })
    .then(comments => {
      res.status(200).send({ comments })
    })
    .catch(next)
}


exports.addCommentToArticle = (req, res, next) => {
  
}

exports.changeVotesOfArticle = () => {

}

