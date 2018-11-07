const formatTopics = (topicData) => {
  return topicData.map(topicDatum => {
    return { ...topicDatum }
  })
}

const formatUsers = (userData) => {
  return userData.map(userDatum => {
    return { ...userDatum }
  })
}

module.exports = { formatTopics, formatUsers }