const Router = require('koa-router')

const router = new Router()
const controller = require('./controller')

router.get('user/:userId', controller.home)
router.post('user', controller.createUser)

module.exports = {
    router
}