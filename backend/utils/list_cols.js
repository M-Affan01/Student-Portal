const db = require('../config/db');

async function listCols() {
    try {
        const [cols] = await db.query('DESCRIBE student_courses');
        console.log('FIELDS SC:', cols.map(c => c.Field).join(', '));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listCols();
