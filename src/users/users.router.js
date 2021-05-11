const Router = require('koa-joi-router')

const {UsersController} = require("./users.controller")
const UserValidator = require('./users.validator')

const router = new Router()

router.post('/sign-in', UserValidator.signIn, UsersController.signIn)
router.post('/example', UserValidator.example, UsersController.example)

module.exports = router
