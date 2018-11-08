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


// Add a new article to a topic. This route requires a JSON body with title and body key value pairs
// # e.g: `{ "title": "new article", "body": "This is my new article content", "created_by": "user_id goes here"}`
exports.addCommentToArticle = () => {

}

exports.changeVotesOfArticle = () => {

}

