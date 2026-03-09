const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function testAiven() {
    console.log('📡 Testing Aiven Connection...');
    const config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        // Skipping SSL for initial check (might fail if mandatory)
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Connected to Aiven!');

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables found:', tables.map(t => Object.values(t)[0]));

        await connection.end();
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        if (err.message.includes('SSL')) {
            console.log('💡 Note: SSL is required. I need the ca.pem file.');
        }
    }
}

testAiven();
