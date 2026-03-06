const db = require('../config/db');

async function checkLatest() {
    try {
        const [rows] = await db.query(`
            SELECT registration_id, student_id, student_name, course_id, status, registration_date 
            FROM course_registrations 
            ORDER BY registration_id DESC 
            LIMIT 5
        `);
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLatest();
