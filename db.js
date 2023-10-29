const { Pool } = require("pg")
require("dotenv").config();
const { env } = process
const pool = new Pool({
    user: env.USER,
    host: env.HOST,
    database: env.DATABASE,
    password: env.PASSWORD,
    port: env.DB_PORT,
})

module.exports = pool;