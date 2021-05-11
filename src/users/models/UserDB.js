const crypto = require('crypto')

const db = require('../../db/db')
const {User} = require('./User')

class UserDB {
    static async getUserById(id) {
        const userResponse = await db.query(`SELECT * FROM "user" WHERE id = ${id}`)

        if (!userResponse.rowCount) throw new Error(`User with id: ${id}, does not exist`)

        return (new User(userResponse.rows[0])).getInfo()
    }

    static async getUserByEmail(email) {
        const userResponse = await db.query(`SELECT * FROM "user" WHERE email = '${email}'`)

        if (!userResponse.rowCount) throw new Error(`User with email: ${email}, does not exist`)

        return userResponse.rows[0]
    }

    static async checkPassword(email, password) {
        const userResponse = await db.query(`SELECT * FROM "user" WHERE email = '${email}'`)

        if (!userResponse.rowCount) return {message: `User with email: ${email}, does not exist`, flag: false}

        const user = {...userResponse.rows[0]}

        if (crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha256').toString('hex') !== user.password) {
            return {message: 'Incorrect password', flag: false}
        }

        return {user: new User(user), flag: true}
    }

    static async createUser(first_name, last_name, active, email, password) {
        const passwordHash = crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha256').toString('hex')
        const createUserResponse = await db.query(`
        INSERT INTO "user" (first_name, last_name, is_active, email, password)
        VALUES ('${first_name}', '${last_name}', ${active}, '${email}', '${passwordHash}') RETURNING *`)
            .catch((err) => {
                console.log(err)
                if (err.constraint === 'user_email') {
                    const error = new Error('User with the same email already exists')
                    error.status = 400
                    throw error
                }
                throw new Error(err.message)
            })
        return (new User(createUserResponse.rows[0])).getInfo()
    }
}

module.exports = {UserDB}
