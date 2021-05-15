const crypto = require('crypto')

const db = require('../../db/db')
const {User} = require('./User')

class UserDB {

    static async checkBeforeRegistration(email, username, first_name, last_name) {
        const userResponse = await db.query(`
        SELECT * FROM "users" WHERE email = '${email}' OR username = '${username}';`)
            .catch((err) => {
                console.log(err)
                if (err.constraint === 'user_email') {
                    const error = new Error('User with the same email already exists')
                    error.status = 400
                    throw error
                }
                throw new Error(err.message)
            })

        if (userResponse.rowCount) {
            const error = new Error('User with same email or username is already registered')
            error.status = 400
            throw error
        }

        const user = {email, username, first_name, last_name}

        return {user}
    }

    static async create(email, username, first_name, last_name, password) {
        const passwordHash = crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha256').toString('hex')
        const createUserResponse = await db.query(`
        INSERT INTO "users" (email, username, first_name, last_name, password)
        VALUES ('${email}', '${username}', '${first_name}', '${last_name}', '${passwordHash}') RETURNING *`)
            .catch((err) => {
                if (err.constraint === 'users_email') {
                    const error = new Error('User with the same email already exists')
                    error.status = 400
                    throw error
                } else if (err.constraint === 'users_username') {
                    const error = new Error('User with the same username already exists')
                    error.status = 400
                    throw error
                }
                throw new Error(err.message)
            })
        console.log("new User: ", new User(createUserResponse.rows[0]))
        return new User(createUserResponse.rows[0])
    }

    static async checkUser(email, password) {
        const userResponse = await db.query(`SELECT * FROM "users" WHERE email = '${email}'`)

        if (!userResponse.rowCount) return {message: `User with email: ${email}, does not exist`, flag: false}

        const user = {...userResponse.rows[0]}

        if (crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha256').toString('hex') !== user.password) {
            return {message: 'Incorrect password', flag: false}
        }

        return {user: new User(user), flag: true}
    }

    static async updateProfile(body) {
        const userResponse = await db.query(`
            UPDATE "users" SET 
                first_name = '${body.first_name}',
                last_name = '${body.last_name}',
                email = '${body.email}',
                username = '${body.username}',
                category = '${body.category}',
                gender = '${body.gender}',
                photo = '${body.photo}',
                country = '${body.photo}',
                stack = '${body.stack}',
                phone = '${body.phone}',
                rate = '${body.rate}'
            WHERE email = '${body.email}' RETURNING *;`)
            .catch(err => {
                if (err.constraint === 'users_email') {
                    const error = new Error(`User with ${body.email} email already exists`)
                    error.status = 400
                    throw error
                } else if (err.constraint === 'users_username') {
                    const error = new Error(`User with ${body.username} username already exists`)
                    error.status = 400
                    throw error
                }
                throw new Error(err.message)
            })
        return new User(userResponse.rows[0])
    }

    static async admin() {
        const userListResponse = await db.query('SELECT * FROM "users"')
        const users = userListResponse.rows.map(userDb => new User(userDb))

        return users
    }

    static async getUserById(id) {
        const userResponse = await db.query(`SELECT * FROM "users" WHERE id = ${id}`)

        if (!userResponse.rowCount) throw new Error(`User with id: ${id}, does not exist`)

        return (new User(userResponse.rows[0])).getInfo()
    }

    static async getUserByEmail(email) {
        const userResponse = await db.query(`SELECT * FROM "users" WHERE email = '${email}'`)

        if (!userResponse.rowCount) throw new Error(`User with email: ${email}, does not exist`)

        return (new User(userResponse.rows[0]))
    }
}

module.exports = {UserDB}
