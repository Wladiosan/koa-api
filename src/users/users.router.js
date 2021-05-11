const Router = require('koa-joi-router')
const passport = require('koa-passport')

const {UsersController} = require("./users.controller")
const UserValidator = require('./users.validator')

const router = new Router()

router.post('/', UserValidator.signUp, UsersController.createUser)
router.post('/sign-in', UserValidator.signIn, UsersController.signIn)

router.get('/profile', passport.authenticate('jwt', {session: false}), UsersController.profile)
router.post('/example', UserValidator.example, UsersController.example)

module.exports = router
