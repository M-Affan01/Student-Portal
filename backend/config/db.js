const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb',
    port: process.env.DB_PORT || 10436,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true
    }
};

// Handle SSL CA for Aiven/Vercel
if (process.env.DB_CA_PATH) {
    try {
        const fs = require('fs');
        const path = require('path');
        // Vercel project root is process.cwd()
        const caPath = path.join(process.cwd(), 'ca.pem');
        poolConfig.ssl.ca = fs.readFileSync(caPath);
        console.log('📡 Database: SSL CA loaded successfully from root');
    } catch (err) {
        console.error('❌ Database SSL Error (Critical for Aiven):', err.message);
    }
}

const pool = mysql.createPool(poolConfig);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }
    if (connection) connection.release();
});

module.exports = pool.promise();
