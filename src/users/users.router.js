const Router = require('koa-joi-router')
const passport = require('koa-passport')

const {UsersController} = require("./users.controller")
const UserValidator = require('./users.validator')

const router = new Router()

router.post('/', UserValidator.checkBeforeRegistration , UsersController.checkBeforeRegistration)
router.post('create', UserValidator.create, UsersController.create)
router.post('sign-in', UserValidator.signIn, UsersController.signIn)

router.get('profile', passport.authenticate('jwt', {session: false}), UsersController.getProfile)
router.put('profile/update', passport.authenticate('jwt', {session: false}), UsersController.updateProfile)


router.get('admin', UsersController.admin)



router.get('admin', passport.authenticate('jwt', {session: false}), UsersController.userList)

router.get('/refresh/token', UsersController.refresh)
router.get('/profile', passport.authenticate('jwt', {session: false}), UsersController.profile)

module.exports = router
