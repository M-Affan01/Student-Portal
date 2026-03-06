const db = require('../config/db');

async function listStudents() {
    try {
        const [rows] = await db.query('SELECT student_id, roll_number, full_name FROM students');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listStudents();
