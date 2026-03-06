const db = require('../config/db');

async function checkRegs() {
    try {
        console.log("Checking recent registrations...");
        const [rows] = await db.query(`
            SELECT r.registration_id, r.student_id, s.full_name, s.roll_number, r.course_id, r.status 
            FROM course_registrations r
            LEFT JOIN students s ON r.student_id = s.student_id
            ORDER BY r.registration_id DESC 
            LIMIT 5
        `);
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkRegs();
