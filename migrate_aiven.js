const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function migrateToAiven() {
    console.log('🚀 Starting Aiven Database Migration...');

    const connectionUrl = process.env.DATABASE_URL;
    const config = connectionUrl || {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 10436,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    };

    // Add SSL for Aiven
    const sslConfig = {};
    if (process.env.DB_CA_PATH) {
        try {
            sslConfig.ca = fs.readFileSync(path.resolve(process.env.DB_CA_PATH));
            console.log('🔒 SSL Configuration detected.');
        } catch (err) {
            console.error('❌ Error reading CA file:', err.message);
            process.exit(1);
        }
    }

    let connection;
    try {
        if (connectionUrl) {
            console.log('📡 Connecting to Aiven via Service URI...');
            // Append multipleStatements and SSL requirements to URI
            const finalUrl = connectionUrl + (connectionUrl.includes('?') ? '&' : '?') + "multipleStatements=true";
            connection = await mysql.createConnection({
                uri: finalUrl,
                ssl: sslConfig.ca ? sslConfig : undefined
            });
        } else {
            console.log(`📡 Connecting to Aiven (${config.host})...`);
            connection = await mysql.createConnection({ ...config, ssl: sslConfig.ca ? sslConfig : undefined });
        }
        console.log('✅ Connected.');

        // Wipe existing tables for a clean migration
        console.log('🧹 Clearing existing tables...');
        const tablesToClear = [
            'notifications', 'attendance', 'fees', 'payments', 'academic_history', 'course_registrations',
            'timetable', 'student_courses', 'teacher_courses', 'courses', 'students', 'teachers', 'departments'
        ];
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        for (const table of tablesToClear) {
            await connection.query(`DROP TABLE IF EXISTS ${table}`);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Tables Cleared.');

        console.log('📦 Applying Schema...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Remove database creation lines if Aiven already created the DB
        const cleanedSchema = schema.replace(/CREATE DATABASE IF NOT EXISTS.*;/gi, '')
            .replace(/DROP DATABASE IF EXISTS.*;/gi, '')
            .replace(/CREATE DATABASE.*;/gi, '')
            .replace(/USE.*;/gi, '');

        await connection.query(cleanedSchema);
        console.log('✅ Schema Applied.');

        console.log('🌱 Seeding Data...');
        const seedPath = path.join(__dirname, 'database', 'seed.sql');
        if (fs.existsSync(seedPath)) {
            const seed = fs.readFileSync(seedPath, 'utf8');
            await connection.query(seed);
            console.log('✅ Seeding Successful!');
        }

        console.log('🎉 Migration Successful! Your database is now live on Aiven.');
    } catch (err) {
        console.error('❌ Migration Failed:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrateToAiven();
