const { User } = require('../models');

exports.getOneUser = (req, res, next) => {
  const username = req.params.username
  User.findOne({ username: username })
    .then(user => {
      res.status(200).send({ user })
    })
    .catch(next)
}