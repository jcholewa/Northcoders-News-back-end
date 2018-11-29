const { Comment } = require('../models')

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

const commentCount = (articleID, article) => {
  return Comment.count({ belongs_to: articleID })
    .then(count => {
      article = article.toJSON();
      article["comment_count"] = count;
      return article;
    })
}

// creates a reference object for number of mentions (e.g. number of comments each topic slug has got)
const createDocsRefObj = (docs) => {
  return docs.reduce((refObj, doc) => {
    if (refObj[doc.belongs_to] != undefined) {
      refObj[doc.belongs_to] += 1;
    }
    else {
      refObj[doc.belongs_to] = 1;
    }
    return refObj
  }, {})
}

const createAuthorRefObj = (docs) => {
  console.log(docs[0].created_by)
  return docs.reduce((refObj, doc) => {
    if (refObj[doc.created_by] != undefined) {
      refObj[doc.created_by] += 1;
    }
    else {
      refObj[doc.created_by] = 1;
    }
    return refObj
  }, {})
}

module.exports = { formatTopics, formatUsers, formatArticles, createRefObj, formatComments, commentCount, createDocsRefObj, createAuthorRefObj }