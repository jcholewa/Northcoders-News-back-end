const usersRouter = require('express').Router();
const { getOneUser, getArticlesForUser } = require('../controllers/users');

usersRouter.get('/:username', getOneUser)

usersRouter.get('/:username/articles', getArticlesForUser)

module.exports = usersRouter;