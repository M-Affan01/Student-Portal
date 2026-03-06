const db = require('../config/db');

async function checkStudent1() {
    try {
        console.log('--- course_registrations (SID=1) ---');
        const [reg] = await db.query('SELECT * FROM course_registrations WHERE student_id = 1');
        console.log(JSON.stringify(reg, null, 2));

        console.log('--- student_courses (SID=1) ---');
        const [sc] = await db.query('SELECT * FROM student_courses WHERE student_id = 1');
        console.log(JSON.stringify(sc, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkStudent1();
