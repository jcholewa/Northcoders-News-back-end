const { Topic, Article, Comment } = require('../models');
const { commentCount } = require('../utils');

exports.getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getArticlesForTopic = (req, res, next) => {
  const topic = req.params.topic_slug;
  Article.find({ belongs_to: topic })
    .then(articles => {
      if (!articles) {
        return Promise.reject({ status: 404, msg: `Articles not found for topic: ${topic}` });
      }
      else {
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
    .catch(next)
}

exports.addArticleToTopic = (req, res, next) => {
  const newArticle = new Article({
    title: req.body.title,
    body: req.body.body,
    votes: req.body.votes,
    created_by: req.body.created_by,
    belongs_to: req.params.topic_slug
  })

  Article.create(newArticle)
    .then(article => {
      return article.populate('created_by').execPopulate()
    })
    .then(article => {
      article = article.toJSON();
      article["comment_count"] = 0;
      res.status(201).send({ article })
    })
    .catch(next)
}