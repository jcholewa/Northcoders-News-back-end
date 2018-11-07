const usersRouter = require('express').Router();
const { getOneUser } = require('../controllers/users');

usersRouter.get('/:username', getOneUser)

/*
endpoint:
GET /api/users/:username - done, no tests yet
*/

module.exports = usersRouter;