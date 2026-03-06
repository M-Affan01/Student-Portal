const db = require('../config/db');

async function checkSchema() {
    try {
        const [tables] = await db.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log('Tables:', tableNames);

        if (tableNames.includes('student_courses')) {
            console.log('student_courses table exists.');
            const [columns] = await db.query('DESCRIBE student_courses');
            console.log('Columns:', columns.map(c => c.Field));
        } else {
            console.log('student_courses table MISSING!');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
