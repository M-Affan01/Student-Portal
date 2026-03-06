const db = require('../config/db');

async function verifyTable() {
    try {
        const [rows] = await db.query('SELECT * FROM student_courses');
        console.log(`Row Count: ${rows.length}`);
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyTable();
