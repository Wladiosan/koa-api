const crypto = require('crypto')

const db = require('../../db/db')
const {User} = require('./User')

class UserDB {

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

    static async resetPass(body) {
        const passwordHash = crypto.pbkdf2Sync(body.password, 'salt', 100000, 64, 'sha256').toString('hex')

        const userResponse = await db.query(`
        UPDATE "users" SET
        password = '${passwordHash}' RETURNING *`)

        return new User(userResponse.rows[0])
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
                country = '${body.country}',
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

    static async getUserList() {
        console.log('123')
        const userResponse = await db.query(`SELECT * FROM "users"`)
        const users = userResponse.rows.map(i => new User(i))
        return users
    }

    static async getUserFilterList({country, category, stack, rate}) {
        console.log('start query', country)
        if (country !== 'All' && category === 'All' && stack === 'All' && rate === 'All') {
            const response = await db.query(`SELECT * from "users" WHERE country = '${country}'`)
            return response.rows.map(i => new User(i))
        } else if (country === 'All' && category !== 'All' && stack === 'All' && rate === 'All') {
            const response = await db.query(`SELECT * from "users" WHERE category = '${category}'`)
            return response.rows.map(i => new User(i))
        } else if (country === 'All' && category === 'All' && stack !== 'All' && rate === 'All') {
            const response = await db.query(`SELECT * from "users" WHERE stack = '${stack}'`)
            return response.rows.map(i => new User(i))
        } else if (country === 'All' && category === 'All' && stack === 'All' && rate !== 'All') {
            if (rate === 'less than $500') {
                const response = await db.query(`SELECT * FROM "users" WHERE rate <= 500`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$501 - $1000') {
                const response = await db.query(`SELECT * FROM "users" WHERE rate > 500 AND rate <= 1000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$1001 - $2000') {
                const response = await db.query(`SELECT * FROM "users" WHERE rate > 1000 AND rate <= 2000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$2001 and more') {
                const response = await db.query(`SELECT * FROM "users" WHERE rate > 2000`)
                return response.rows.map(i => new User(i))
            }
            return 'error in 4 block'
        } else if (country !== 'All' && category !== 'All' && stack === 'All' && rate === 'All') {
            const response = await db.query(`SELECT * from "users" WHERE country = '${country}' AND category = '${category}'`)
            return response.rows.map(i => new User(i))
        } else if (country !== 'All' && category === 'All' && stack !== 'All' && rate === 'All') {
            const response = await db.query(`SELECT * from "users" WHERE country = '${country}' AND stack = '${stack}'`)
            return response.rows.map(i => new User(i))
        } else if (country !== 'All' && category === 'All' && stack === 'All' && rate !== 'All') {
            if (rate === 'less than $500') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND rate <= 500`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$501 - $1000') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND rate > 500 AND rate <= 1000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$1001 - $2000') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND rate > 1000 AND rate <= 2000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$2001 and more') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND rate > 2000`)
                return response.rows.map(i => new User(i))
            }
            return 'error in 14 block'
        } else if (country === 'All' && category !== 'All' && stack !== 'All' && rate === 'All') {
            const response = await db.query(`SELECT * from "users" WHERE category = '${category}' AND stack = '${stack}'`)
            return response.rows.map(i => new User(i))
        } else if (country === 'All' && category !== 'All' && stack === 'All' && rate !== 'All') {
            if (rate === 'less than $500') {
                const response = await db.query(`SELECT * FROM "users" WHERE category = '${category}' AND rate <= 500`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$501 - $1000') {
                const response = await db.query(`SELECT * FROM "users" WHERE category = '${category}' AND rate > 500 AND rate <= 1000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$1001 - $2000') {
                const response = await db.query(`SELECT * FROM "users" WHERE category = '${category}' AND rate > 1000 AND rate <= 2000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$2001 and more') {
                const response = await db.query(`SELECT * FROM "users" WHERE category = '${category}' AND rate > 2000`)
                return response.rows.map(i => new User(i))
            }
            return 'error in 24 block'
        } else if (country === 'All' && category === 'All' && stack !== 'All' && rate !== 'All') {
            if (rate === 'less than $500') {
                const response = await db.query(`SELECT * FROM "users" WHERE stack = '${stack}' AND rate <= 500`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$501 - $1000') {
                const response = await db.query(`SELECT * FROM "users" WHERE stack = '${stack}' AND rate > 500 AND rate <= 1000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$1001 - $2000') {
                const response = await db.query(`SELECT * FROM "users" WHERE stack = '${stack}' AND rate > 1000 AND rate <= 2000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$2001 and more') {
                const response = await db.query(`SELECT * FROM "users" WHERE stack = '${stack}' AND rate > 2000`)
                return response.rows.map(i => new User(i))
            }
            return 'error in 34 block'
        } else if (country !== 'All' && category !== 'All' && stack !== 'All' && rate === 'All') {
            const response = await db.query(`SELECT * from "users" WHERE country = '${country}' AND category = '${category}' AND stack = '${stack}'`)
            return response.rows.map(i => new User(i))
        } else if (country !== 'All' && category !== 'All' && stack === 'All' && rate !== 'All') {
            if (rate === 'less than $500') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND category = '${category}' AND rate <= 500`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$501 - $1000') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND category = '${category}' AND rate > 500 AND rate <= 1000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$1001 - $2000') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND category = '${category}' AND rate > 1000 AND rate <= 2000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$2001 and more') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND category = '${category}' AND rate > 2000`)
                return response.rows.map(i => new User(i))
            }
            return 'error in 123 block'
        } else if (country !== 'All' && category === 'All' && stack !== 'All' && rate !== 'All') {
            if (rate === 'less than $500') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND stack = '${stack}' AND rate <= 500`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$501 - $1000') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND stack = '${stack}' AND rate > 500 AND rate <= 1000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$1001 - $2000') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND stack = '${stack}' AND rate > 1000 AND rate <= 2000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$2001 and more') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND stack = '${stack}' AND rate > 2000`)
                return response.rows.map(i => new User(i))
            }
            return 'error in 134 block'
        } else if (country === 'All' && category !== 'All' && stack !== 'All' && rate !== 'All') {
            if (rate === 'less than $500') {
                const response = await db.query(`SELECT * FROM "users" WHERE category = '${category}' AND stack = '${stack}' AND rate <= 500`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$501 - $1000') {
                const response = await db.query(`SELECT * FROM "users" WHERE category = '${category}' AND stack = '${stack}' AND rate > 500 AND rate <= 1000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$1001 - $2000') {
                const response = await db.query(`SELECT * FROM "users" WHERE category = '${category}' AND stack = '${stack}' AND rate > 1000 AND rate <= 2000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$2001 and more') {
                const response = await db.query(`SELECT * FROM "users" WHERE category = '${category}' AND stack = '${stack}' AND rate > 2000`)
                return response.rows.map(i => new User(i))
            }
            return 'error in 234 block'
        } else if (country !== 'All' && category !== 'All' && stack !== 'All' && rate !== 'All') {
            if (rate === 'less than $500') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND category = '${category}' AND stack = '${stack}' AND rate <= 500`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$501 - $1000') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND category = '${category}' AND stack = '${stack}' AND rate > 500 AND rate <= 1000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$1001 - $2000') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND category = '${category}' AND stack = '${stack}' AND rate > 1000 AND rate <= 2000`)
                return response.rows.map(i => new User(i))
            } else if (rate === '$2001 and more') {
                const response = await db.query(`SELECT * FROM "users" WHERE country = '${country}' AND category = '${category}' AND stack = '${stack}' AND rate > 2000`)
                return response.rows.map(i => new User(i))
            }
            return 'error in 1234 block'
        }
        const response = await db.query(`SELECT * FROM "users"`)
        const users = response.rows.map(userDb => new User(userDb))
        return users
    }


    /*static async userList() {
        const userListResponse = await db.query('SELECT * FROM "users"')
        const users = userListResponse.rows[0]
        console.log(users)
        return users
        /!*rows.map(userDb => new User(userDb))*!/
    }*/


    /*static async admin() {
        const userListResponse = await db.query('SELECT * FROM "users"')
        const users = userListResponse.rows.map(userDb => new User(userDb))
        return users
    }*/
}

module.exports = {UserDB}
