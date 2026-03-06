const db = require('../config/db');

async function checkOrphans() {
    try {
        console.log('Checking for orphans in course_registrations...');
        const [regOrphans] = await db.query(`
            SELECT r.* FROM course_registrations r
            LEFT JOIN students s ON r.student_id = s.student_id
            WHERE s.student_id IS NULL
        `);
        console.log(`Orphans in course_registrations: ${regOrphans.length}`);
        if (regOrphans.length > 0) console.table(regOrphans);

        console.log('\nChecking for orphans in student_courses...');
        const [scOrphans] = await db.query(`
            SELECT sc.* FROM student_courses sc
            LEFT JOIN students s ON sc.student_id = s.student_id
            WHERE s.student_id IS NULL
        `);
        console.log(`Orphans in student_courses: ${scOrphans.length}`);
        if (scOrphans.length > 0) console.table(scOrphans);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOrphans();
