const db = require('../config/db');

async function describeTables() {
    try {
        console.log('--- course_registrations ---');
        const [regCols] = await db.query('DESCRIBE course_registrations');
        console.log(JSON.stringify(regCols, null, 2));

        console.log('--- student_courses ---');
        const [scCols] = await db.query('DESCRIBE student_courses');
        console.log(JSON.stringify(scCols, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

describeTables();
