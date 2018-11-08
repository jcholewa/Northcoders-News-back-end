const usersRouter = require('express').Router();
const { getOneUser } = require('../controllers/users');

usersRouter.get('/:username', getOneUser)

module.exports = usersRouter;