const { Topic, Article } = require('../models');

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
      res.status(200).send({ articles })
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
      res.status(201).send({ article })
    })
    .catch(next)

}
