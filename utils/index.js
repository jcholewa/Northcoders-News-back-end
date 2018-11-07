const formatTopics = (topicData) => {
  return topicData.map(topicDatum => {
      return {...topicDatum}
  })
}

module.exports = {formatTopics}