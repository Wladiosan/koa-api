const passport = require('koa-passport')
const jwt = require('jwt-simple')

const {User} = require('./models/User')
const {UserDB} = require('./models/UserDB')

class UsersController {

    // start
    static async healthCheck(ctx) {
        ctx.status = 200
        ctx.body = 'healthCheck'
    }

    //
    static async checkBeforeRegistration(ctx) {
        const {email, username, first_name, last_name} = ctx.request.body
        ctx.body = await UserDB.checkBeforeRegistration(email, username, first_name, last_name)
    }

    //create
    static async create(ctx) {
        const {email, username, first_name, last_name, password} = ctx.request.body
        ctx.status = 201
        ctx.body = (await (UserDB.create(email, username, first_name, last_name, password))).getInfo()
    }

    //sign-in
    static async signIn(ctx, next) {
        await passport.authenticate('local', (err, user) => {
            if (user) {
                ctx.body = user
            } else {
                ctx.status = 400
                if (err) {
                    ctx.body = {
                        error: err
                    }
                }
            }
        })(ctx, next)
    }

    //profile
    static async getProfile(ctx) {
        const {email} = ctx.state.user
        const user = (await UserDB.getUserByEmail(email)).getInfo()
        ctx.status = 200
        ctx.body = user
    }

    //profile //profile/account
    static async updateProfile(ctx) {
        const {body} = ctx.request.body
        const user = (await UserDB.updateProfile(body)).getInfo()
        ctx.status = 200
        ctx.body = {user}
    }

    //reset-pass
    static async resetPass(ctx) {
        const {body} = ctx.request.body
        const user = (await UserDB.resetPass(body)).getInfo()
        ctx.status = 200
        ctx.body = {user}
    }

    //search
    static async userList(ctx) {
        const users = (await UserDB.getUserList()).map(i => i.getInfo(true))
        ctx.status = 200
        ctx.body = {users}
    }

    //search
    static async userFilterList(ctx) {
        const {body} = ctx.request.body
        const users = (await UserDB.getUserFilterList(body)).map(i => i.getInfo(true))
        ctx.status = 200
        ctx.body = {
            users
        }
    }

    //admin
    static async admin(ctx) {
        const users = (await UserDB.admin()).map(i => i.getInfoAdmin(true))
        ctx.body = {
            users
        }
    }


    static async refresh(ctx) {
        const token = ctx.headers.authorization.split(' ')[1]
        const decodedToken = jwt.decode(token, 'super_secret_refresh')

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

    static async removeUser(ctx) {
        const {body} = ctx.request
        const newUserList = (await UserDB.deleteUser(body)).map(i => i.getInfoAdmin(true))
        console.log('newUserList: ', newUserList)
        ctx.status = 200
        ctx.body = {
            newUserList
        }
    }
}

module.exports = {
    UsersController
}
