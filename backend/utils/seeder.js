const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting Database Seeder...');

        // Create connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true // Enable multiple statements for SQL script
        });

        console.log('✅ Connected to MySQL Server');

        // Create DB if not exists (and use it)
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);
        console.log(`✅ Selected Database: ${process.env.DB_NAME}`);

        // Read SQL file
        const sqlPath = path.join(__dirname, '../../database/seed.sql');
        const schemaPath = path.join(__dirname, '../../database/schema.sql');

        // We run schema first to ensure fresh tables, then seed
        // WARNING: This clears data. This is what we want for "Reset".

        console.log('📜 Reading Schema File...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('📜 Reading Seed File...');
        const seedSql = fs.readFileSync(sqlPath, 'utf8');

        console.log('⚡ Executing Schema...');
        await connection.query(schemaSql);

        console.log('⚡ Executing Seed...');
        await connection.query(seedSql);

        console.log('🎉 Database Seeded Successfully!');
        console.log('🔑 Login with: CS-2023-001 / password123');

        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seedDatabase();
