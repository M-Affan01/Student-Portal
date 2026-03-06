const db = require('../config/db');

async function countBoth() {
    try {
        const [tables] = await db.query('SHOW TABLES');
        const list = tables.map(t => Object.values(t)[0]);

        if (list.includes('course_registration')) {
            const [rows] = await db.query('SELECT COUNT(*) as count FROM course_registration');
            console.log(`course_registration (singular): ${rows[0].count}`);
        } else {
            console.log('course_registration (singular) does not exist');
        }

        if (list.includes('course_registrations')) {
            const [rows] = await db.query('SELECT COUNT(*) as count FROM course_registrations');
            console.log(`course_registrations (plural): ${rows[0].count}`);
        } else {
            console.log('course_registrations (plural) does not exist');
        }

        const [sc] = await db.query('SELECT COUNT(*) as count FROM student_courses');
        console.log(`student_courses: ${sc[0].count}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

countBoth();
