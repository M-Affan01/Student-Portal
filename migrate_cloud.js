const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function migrateToCloud() {
    console.log('🚀 Starting Aiven Cloud Migration...');

    const config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    };

    // Add SSL if CA is provided
    if (process.env.DB_CA_PATH) {
        try {
            config.ssl = {
                ca: fs.readFileSync(process.env.DB_CA_PATH)
            };
            console.log('🔒 SSL Configuration detected.');
        } catch (err) {
            console.error('❌ Error reading CA file:', err.message);
            process.exit(1);
        }
    }

    const connection = await mysql.createConnection(config);

    try {
        console.log(`📡 Connected to ${config.host}.`);

        console.log('📦 Applying Schema...');
        const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
        // Remove database creation lines if Aiven already created the DB
        const cleanedSchema = schema.replace(/CREATE DATABASE IF NOT EXISTS.*;/gi, '')
            .replace(/USE.*;/gi, '');
        await connection.query(cleanedSchema);

        console.log('🌱 Seeding 50+ Courses & Schedules...');
        const seed = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');
        await connection.query(seed);

        console.log('✅ Migration Successful! Your database is now live on Aiven.');
    } catch (err) {
        console.error('❌ Migration Failed:', err.message);
        if (err.message.includes('Access denied')) {
            console.log('💡 Tip: Make sure your Aiven User and Password are correct.');
        }
    } finally {
        await connection.end();
    }
}

migrateToCloud();
