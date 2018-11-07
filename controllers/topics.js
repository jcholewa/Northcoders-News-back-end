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
}

exports.addArticleToTopic = () => {

}
