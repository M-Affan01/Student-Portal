const db = require('../config/db');
const fs = require('fs');

async function dumpStudents() {
    try {
        const [rows] = await db.query('SELECT student_id, roll_number, full_name FROM students');
        fs.writeFileSync('students_dump.txt', JSON.stringify(rows, null, 2));
        console.log('Students dumped to students_dump.txt');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dumpStudents();
