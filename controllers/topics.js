const { Topic } = require('../models');

exports.getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getArticlesForTopic = () => {

}

exports.addArticleToTopic = () => {

}
