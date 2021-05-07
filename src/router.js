const Router = require('koa-router')
const passport = require('koa-passport')

const router = new Router()
const controller = require('./controller')

router.post('sign-in', controller.signIn)
router.get('profile', passport.authenticate('jwt', { session: false }), controller.profile)
router.get('refresh', controller.refresh);

router.post('user', controller.createUser)
router.post('create', controller.create)
router.get('user/:userId', controller.home)
router.get('user-list', controller.userList)

module.exports = {
    router
}
