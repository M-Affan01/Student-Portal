const db = require('../config/db');

async function checkDB() {
    try {
        const [rows] = await db.query('SELECT DATABASE() as db');
        console.log('ACTIVE_DB:', rows[0].db);

        const [tables] = await db.query('SHOW TABLES');
        console.log('TABLES_IN_POOL:');
        tables.forEach(t => console.log(' - ' + Object.values(t)[0]));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
