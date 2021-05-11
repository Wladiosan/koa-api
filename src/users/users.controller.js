const { User } = require('./models/User')
const { UserDB } = require('./models/UserDB')
const passport = require('koa-passport')

class UsersController {
    static async example(ctx) {
        const { body } = ctx.request
        ctx.body = { body }
    }

    static async signIn(ctx, next) {
        await passport.authenticate('local', (err, user) => {
            if (user) {
                ctx.body = user
            } else {
                ctx.status = 400
                if (err) {
                    ctx.body = {error: err}
                }
            }
        })(ctx, next)
    }
}

module.exports = {
    UsersController
}
