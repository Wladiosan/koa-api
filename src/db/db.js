const { Pool } = require('pg')

class Database {
    constructor() {
        this.config = {
            user: 'postgres',
            host: 'localhost',
            database: 'avacoder',
            password: '1234567890',
            port: 5432
        }
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