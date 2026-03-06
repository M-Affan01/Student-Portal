const db = require('../config/db');

async function checkCoursesColumns() {
    try {
        const [columns] = await db.query('DESCRIBE courses');
        console.log('Courses Table Columns:', JSON.stringify(columns.map(c => c.Field), null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCoursesColumns();
