const Router = require('koa-joi-router')
const passport = require('koa-passport')

const {UsersController} = require("./users.controller")
const UserValidator = require('./users.validator')

const router = new Router()

router.post('/', UserValidator.checkBeforeRegistration , UsersController.checkBeforeRegistration)
router.post('create', UserValidator.create, UsersController.create)
router.post('sign-in', UserValidator.signIn, UsersController.signIn)
router.post('admin', UsersController.removeUser)

router.put('reset-pass', passport.authenticate('jwt', {session: false}), UsersController.resetPass)
router.put('profile/update', passport.authenticate('jwt', {session: false}), UsersController.updateProfile)
router.put('search', passport.authenticate('jwt', {session: false}), UsersController.userFilterList)

router.get('/', UsersController.healthCheck)
router.get('profile', passport.authenticate('jwt', {session: false}), UsersController.getProfile)
router.get('search', passport.authenticate('jwt', {session: false}), UsersController.userList)
router.get('admin', UsersController.admin)

/*router.get('admin', passport.authenticate('jwt', {session: false}), UsersController.userList)*/
router.get('/refresh/token', UsersController.refresh)
/*router.get('/profile', passport.authenticate('jwt', {session: false}), UsersController.profile)*/

module.exports = router
