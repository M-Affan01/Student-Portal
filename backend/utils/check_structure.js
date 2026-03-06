const db = require('../config/db');

async function check() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM students');
        console.log(columns.map(c => c.Field));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

check();
