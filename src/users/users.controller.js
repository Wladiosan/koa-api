const passport = require('koa-passport')

const {User} = require('./models/User')
const {UserDB} = require('./models/UserDB')

class UsersController {

    static async example(ctx) {
        const {body} = ctx.request
        ctx.body = {body}
    }

    static async signIn(ctx, next) {
        await passport.authenticate('local', (err, user) => {
            if (user) ctx.body = user
            else {
                ctx.status = 400
                if (err) ctx.body = {error: err}
            }
        })(ctx, next)
    }

    static async createUser(ctx) {
        const {first_name, last_name, active, email, password} = ctx.request.body

        ctx.status = 201
        ctx.body = await UserDB.createUser(first_name, last_name, active, email, password)

    }

    static async profile(ctx) {
        ctx.body = {
            user: ctx.state.user
        }
    }
}

module.exports = {
    UsersController
}
