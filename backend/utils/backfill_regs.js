const db = require('../config/db');

async function backfillRegs() {
    try {
        console.log('Backfilling student details in course_registrations...');

        // Update query using JOIN
        const [result] = await db.query(`
            UPDATE course_registrations r
            JOIN students s ON r.student_id = s.student_id
            SET r.student_name = s.full_name, r.roll_number = s.roll_number
            WHERE r.student_name IS NULL
        `);

        console.log(`Backfill complete. Updated ${result.affectedRows} rows.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

backfillRegs();
