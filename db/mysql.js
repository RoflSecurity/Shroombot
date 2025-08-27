const mysql = require('mysql');
const { promisify } = require('util');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const query = promisify(pool.query).bind(pool);

async function initDB() {
    try {
        await query(`CREATE TABLE IF NOT EXISTS shroom_slaves (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(2000),
            ip VARCHAR(2000),
            status VARCHAR(2000) DEFAULT 'active'
        )`);
        console.log('[DB] Table shroom_slaves ready');
    } finally {
        pool.end();
    }
}

module.exports = { pool, query, initDB };
