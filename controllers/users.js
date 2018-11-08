const { User } = require('../models');

exports.getOneUser = (req, res, next) => {
  const userName = req.params.username
  User.findOne({username: userName})
    .then(user => {
      if (!user) return Promise.reject({status: 404, msg: `User not found for username: ${userName}`});
      res.status(200).send({ user })
    })
    .catch(next)
}