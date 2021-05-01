const db = require('./db/db')
const validator = require('./validator')

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

module.exports = {
    home,
    createUser
}