const crypto = require('crypto')
const db = require('./db/db')
const passport = require('koa-passport')

const validator = require('./validator')


async function signIn(ctx) {
    await passport.authenticate('local', (err, user) => {
        if (user) {
            ctx.body = user
        } else {
            ctx.status = 400
            if (err) {
                ctx.body = { error: err }
            }
        }
    })(ctx)
}

async function profile(ctx) {
    console.log(ctx.state)
    ctx.body = {
        user: ctx.state.user,
    };
}

async function refresh(ctx) {
    const token = ctx.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token, 'super_secret_refresh');

    if (decodedToken.expiresIn <= new Date().getTime()) {
        const error = new Error('Refresh token expired, please sign in into your account.');
        error.status = 400;

        throw error;
    }

    const user = await UserDB.getUserByEmail(decodedToken.email);

    const accessToken = {
        id: user.id,
        expiresIn: new Date().setTime(new Date().getTime() + 200000),
    };
    const refreshToken = {
        email: user.email,
        expiresIn: new Date().setTime(new Date().getTime() + 1000000),
    };

    ctx.body = {
        accessToken: jwt.encode(accessToken, 'super_secret'),
        accessTokenExpirationDate: accessToken.expiresIn,
        refreshToken: jwt.encode(refreshToken, 'super_secret_refresh'),
        refreshTokenExpirationDate: refreshToken.expiresIn,
    };
}

async function home(ctx) {
    // user/:userId
    const {userId} = ctx.request.params

    const userResponse = await db.query(`SELECT * FROM "user" WHERE id = ${userId}`)

    // Проверка на наличие user по userId
    if (!userResponse.rowCount) {
        ctx.throw(400, 'User does not exist yet')
    }

    const user = userResponse.rows[0]
    console.log(user)
    ctx.body = ''
}

async function createUser(ctx) {
    // need for use install 'koa-bodyparser', write before routers.
    const body = ctx.request.body

    // Validator
    await validator.schema.validateAsync(body)

    // Crypto password
    body.password = crypto.pbkdf2Sync(body.password, 'salt', 100000, 64, 'sha256').toString('hex')

    const createUserResponse = await db.query(`
    INSERT INTO "user" (email, first_name, last_name, password, is_active)
    VALUES ('${body.email}', '${body.first_name}', '${body.last_name}', '${body.password}', ${body.is_active}) 
    RETURNING *`)
    const user = {...createUserResponse.rows[0]}
    console.log(user)
    ctx.status = 201
    ctx.body = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: user.password,
        is_active: user.is_active
    }
}

async function create(ctx) {
    // need for use install 'koa-bodyparser', write before routers.
    const body = ctx.request.body

    // Validator
    await validator.create.validateAsync(body)

    const createUserResponse = await db.query(`
    INSERT INTO "sign_in" (email, password) VALUES ('${body.email}', '${body.password}') RETURNING *`)
    const user = {...createUserResponse.rows[0]}
    ctx.status = 201
    ctx.body = {
        id: user.id,
        email: user.email,
        password: user.password,
    }
}

async function userList(ctx) {
    const userListResponse = await db.query('SELECT * FROM "sign_in"')

    if (!userListResponse.rowCount) {
        ctx.throw(400, 'User does not exist yet')
    }

    const users = userListResponse.rows
    const userLength = userListResponse.rowCount
    ctx.body = {
        users,
        userLength
    }
}

module.exports = {
    signIn,
    profile,
    refresh,
    home,
    createUser,
    create,
    userList
}
