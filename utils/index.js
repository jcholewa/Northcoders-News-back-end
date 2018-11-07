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

const createRefObj = (docs) => {
  return docs.reduce((refObj, doc, index) => {
    refObj[doc["username"]] = docs[index]._id
    return refObj;
  }, {})
}

const formatArticles = (articleData, userRefObj) => {
  return articleData.map(articleDatum => {
    return {
      ...articleDatum,
      belongs_to: articleDatum.topic,
      created_by: userRefObj[articleDatum.created_by]
    }
  })
}

module.exports = { formatTopics, formatUsers, formatArticles, createRefObj}