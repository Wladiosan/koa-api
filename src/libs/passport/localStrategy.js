const LocalStrategy = require('passport-local')
const jwt = require('jwt-simple')

const { UserDB } = require('../../users/models/UserDB')

const opts = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    session: false,
}

module.exports = new LocalStrategy(opts, async (req, email, password, done) => {
    UserDB.checkUser(email, password).then((checkUserResponse) => {
        if (!checkUserResponse.flag) {
            return done({ message: checkUserResponse.message }, false)
        }

        const { user } = checkUserResponse

        const accessToken = {
            id: user.getId(),
            expiresIn: new Date().setTime(new Date().getTime() + 500000),
        }
        const refreshToken = {
            email: user.email,
            expiresIn: new Date().setTime(new Date().getTime() + 1000000),
        }

        const responseData = user.getInfo()

        responseData.tokens = {
            accessToken: jwt.encode(accessToken, 'super_secret'),
            accessTokenExpirationDate: accessToken.expiresIn,
            refreshToken: jwt.encode(refreshToken, 'super_secret_refresh'),
            refreshTokenExpirationDate: refreshToken.expiresIn,
        }

        return done(null, responseData)
    }).catch((err) => done({ message: err.message }, false))
})
