const Router = require('koa-joi-router')
const passport = require('koa-passport')

const {UsersController} = require("./users.controller")
const UserValidator = require('./users.validator')

const router = new Router()

router.post('/', UserValidator.checkBeforeRegistration , UsersController.checkBeforeRegistration)
router.post('create', UserValidator.create, UsersController.create)

router.post('/sign-in', UserValidator.signIn, UsersController.signIn)



router.post('create-1', UserValidator.signUp, UsersController.createUser)

router.get('/', passport.authenticate('jwt', {session: false}), UsersController.userList)

router.get('/refresh/token', UsersController.refresh)

router.get('/profile', passport.authenticate('jwt', {session: false}), UsersController.profile)

/*router.post('/example', UserValidator.example, UsersController.example)*/

module.exports = router
