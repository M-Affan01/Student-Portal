const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function migrateToRailway() {
    console.log('🚀 Starting Railway Cloud Migration...');

    // Priority: Railway provided MYSQL_URL or individual variables
    const config = process.env.MYSQL_URL || {
        host: process.env.MYSQLHOST || process.env.DB_HOST,
        port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
        user: process.env.MYSQLUSER || process.env.DB_USER,
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
        database: process.env.MYSQLDATABASE || process.env.DB_NAME,
        multipleStatements: true
    };

    let connection;
    try {
        if (typeof config === 'string') {
            connection = await mysql.createConnection(config + "?multipleStatements=true");
            console.log('📡 Connected via MYSQL_URL.');
        } else {
            connection = await mysql.createConnection(config);
            console.log(`📡 Connected to ${config.host}.`);
        }

        console.log('📦 Applying Schema...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found at ${schemaPath}`);
        }
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Remove database creation lines if Railway already created the DB
        const cleanedSchema = schema.replace(/CREATE DATABASE IF NOT EXISTS.*;/gi, '')
            .replace(/USE.*;/gi, '');

        await connection.query(cleanedSchema);
        console.log('✅ Schema Applied.');

        console.log('🌱 Seeding Data...');
        const seedPath = path.join(__dirname, 'database', 'seed.sql');
        if (fs.existsSync(seedPath)) {
            const seed = fs.readFileSync(seedPath, 'utf8');
            await connection.query(seed);
            console.log('✅ Seeding Successful!');
        } else {
            console.log('⚠️ Seed file not found, skipping seeding.');
        }

        console.log('🎉 Migration Successful! Your database is now live on Railway.');
    } catch (err) {
        console.error('❌ Migration Failed:', err.message);
        console.log('💡 Tip: Make sure your Railway environment variables are set correctly in your .env file for local testing.');
    } finally {
        if (connection) await connection.end();
    }
}

migrateToRailway();
