const { Pool } = require('pg')

class Database {
    constructor() {
        this.config = {
            user: 'koa',
            host: 'koa-db.crvoexiomdmy.eu-central-1.rds.amazonaws.com',
            database: 'koa',
            password: '1234567890',
            port: 5432
        }
        /*this.config = {
            user: procces.env.DB_USER,
            host: procces.env.DB_HOST,
            database: process.env.DB_NAME,
            password: procces.env.DB_PASSWORD,
            port: 5432
        }*/
        this.pool = new Pool(this.config)
    }
    query(sql) {
        return this.pool.query(sql)
    }
    close() {
        this.pool.end()
    }
}

module.exports = new Database()
