const db = require('../config/db');

async function dumpAll() {
    try {
        console.log('--- ALL REGISTRATIONS ---');
        const [reg] = await db.query('SELECT registration_id, student_id, full_name, roll_number, course_id FROM course_registrations');
        reg.forEach(r => console.log(`REG: ID=${r.registration_id} SID=${r.student_id} NAME=${r.full_name} ROLL=${r.roll_number} CID=${r.course_id}`));

        console.log('--- ALL STUDENT_COURSES ---');
        const [sc] = await db.query('SELECT id, student_id, full_name, roll_number, course_id FROM student_courses');
        sc.forEach(s => console.log(`SC: ID=${s.id} SID=${s.student_id} NAME=${s.full_name} ROLL=${s.roll_number} CID=${s.course_id}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dumpAll();
