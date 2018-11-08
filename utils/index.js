const formatTopics = (topicData) => {
  return topicData.map(topicDatum => {
    return { ...topicDatum }
  })
}

const formatUsers = (userData) => {
  // console.log(userData)
  return userData.map(userDatum => {
    return { ...userDatum }
  })
}

const createRefObj = (docs, key) => {
  return docs.reduce((refObj, doc, index) => {
    refObj[doc[key]] = docs[index]._id
    return refObj;
  }, {})
}

const formatArticles = (articleData, userRefObj) => {
  return articleData.map(articleDatum => {
    return {
      ...articleDatum,
      belongs_to: articleDatum.topic,
      created_by: userRefObj[articleDatum.created_by],
      votes: articleDatum.votes || 0
    }
  })
}

const formatComments = (commentData, userRefObj, articleRefObj) => {
  return commentData.map(commentDatum => {
    return {
      body: commentDatum.body,
      votes: commentDatum.votes || 0,
      created_at: commentDatum.created_at,
      created_by: userRefObj[commentDatum.created_by],
      belongs_to: articleRefObj[commentDatum.belongs_to]
    }
  })
}

module.exports = { formatTopics, formatUsers, formatArticles, createRefObj, formatComments }