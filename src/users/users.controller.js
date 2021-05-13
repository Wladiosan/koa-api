const passport = require('koa-passport')
const jwt = require('jwt-simple')

const {User} = require('./models/User')
const {UserDB} = require('./models/UserDB')

class UsersController {

    static async checkBeforeRegistration(ctx) {
        const {email, username, first_name, last_name} = ctx.request.body
        ctx.body = await UserDB.checkBeforeRegistration(email, username, first_name, last_name)
    }

    static async create(ctx) {
        const {email, username, first_name, last_name, password } = ctx.request.body

        ctx.status = 201
        ctx.body = (await (UserDB.create(email, username, first_name, last_name, password))).getInfoUser()
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

    static async admin(ctx) {
        const users = (await UserDB.admin()).map(user => user.getInfoAdmin())
        ctx.body = {
            users
        }
    }





    static async refresh(ctx) {
        const token = ctx.headers.authorization.split(' ')[1]
        const decodedToken = jwt.decode(token, 'super_secret_refresh')

        console.log(decodedToken)

        if (decodedToken.expiresIn <= new Date().getTime()) {
            const error = new Error('Refresh token expired, please sign in into your account.')
            error.status = 400
            throw error
        }

        const user = await UserDB.getUserByEmail(decodedToken.email)

        const accessToken = {
            id: user.getId(),
            expiresIn: new Date().setTime(new Date().getTime() + 200000)
        }

        const refreshToken = {
            email: user.email,
            expiresIn: new Date().setTime(new Date().getTime() + 1000000)
        }

        ctx.body = {
            accessToken: jwt.encode(accessToken, 'super_secret'),
            accessTokenExpirationDate: accessToken.expiresIn,
            refreshToken: jwt.encode(refreshToken, 'super_secret_refresh'),
            refreshTokenExpirationDate: refreshToken.expiresIn
        }
    }

    static async profile(ctx) {
        ctx.body = {
            user: ctx.state.user
        }
    }

    static async userList(ctx) {
        const users = (await UserDB.userList()).map(user => user.getInfo())
        ctx.body = {
            users
        }
    }
}

module.exports = {
    UsersController
}
