const db = require('../config/db');

async function checkStudentsColumns() {
    try {
        const [columns] = await db.query('DESCRIBE students');
        console.log('Students Table Columns:', JSON.stringify(columns.map(c => c.Field), null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkStudentsColumns();
