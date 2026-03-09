const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function migrateToPlanetScale() {
    console.log('🚀 Starting PlanetScale Migration...');

    const connectionUrl = process.env.DATABASE_URL;
    if (!connectionUrl) {
        console.error('❌ Error: DATABASE_URL not found in .env file.');
        console.log('💡 Tip: Get your connection string from PlanetScale dashboard.');
        return;
    }

    let connection;
    try {
        console.log('📡 Connecting to PlanetScale...');
        // PlanetScale requires SSL
        connection = await mysql.createConnection(connectionUrl + (connectionUrl.includes('?') ? '&' : '?') + "multipleStatements=true");
        console.log('✅ Connected.');

        console.log('📦 Applying Schema...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // PlanetScale doesn't support 'CREATE DATABASE' or 'USE database' in branches
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
        }

        console.log('🎉 Migration Successful! Your database is now live on PlanetScale.');
    } catch (err) {
        console.error('❌ Migration Failed:', err.message);
        console.error(err);
    } finally {
        if (connection) await connection.end();
    }
}

migrateToPlanetScale();
