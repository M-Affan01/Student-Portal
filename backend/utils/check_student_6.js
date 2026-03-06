const db = require('../config/db');

async function checkStudent6() {
    try {
        const [rows] = await db.query('SELECT * FROM course_registrations WHERE student_id = 6');
        console.log(`Registrations for Student 6: ${rows.length}`);
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkStudent6();
