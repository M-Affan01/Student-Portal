const db = require('../config/db');

async function checkBoth() {
    try {
        const [tables] = await db.query('SHOW TABLES');
        const list = tables.map(t => Object.values(t)[0]);

        if (list.includes('course_registration')) {
            console.log('--- course_registration (singular) columns ---');
            const [cols] = await db.query('DESCRIBE course_registration');
            console.table(cols);
        } else {
            console.log('course_registration (singular) DOES NOT EXIST');
        }

        if (list.includes('course_registrations')) {
            console.log('--- course_registrations (plural) columns ---');
            const [cols] = await db.query('DESCRIBE course_registrations');
            console.table(cols);
        } else {
            console.log('course_registrations (plural) DOES NOT EXIST');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkBoth();
