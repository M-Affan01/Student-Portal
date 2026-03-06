const db = require('../config/db');

async function verifyStudent6() {
    try {
        const [s] = await db.query('SELECT * FROM students WHERE student_id = 6');
        console.log('Student 6 Exists:', s.length > 0);
        if (s.length > 0) console.log(s[0]);

        const [r] = await db.query('SELECT COUNT(*) as count FROM course_registrations WHERE student_id = 6');
        console.log('Reg Count:', r[0].count);

        const [sc] = await db.query('SELECT COUNT(*) as count FROM student_courses WHERE student_id = 6');
        console.log('StudentCourses Count:', sc[0].count);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyStudent6();
