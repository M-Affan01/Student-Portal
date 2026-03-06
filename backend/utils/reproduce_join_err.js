const db = require('../config/db');

async function reproduce() {
    try {
        console.log('Running reproductive query (LEFT JOIN departments)...');
        const [rows] = await db.query(`
            SELECT s.student_id, d.department_name
            FROM students s
            LEFT JOIN departments d ON s.dept_id = d.department_id
            WHERE s.student_id = 6
        `);
        console.log('Query completed successfully.');
        console.log('Result:', JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('REPRODUCTION FAILED:', err);
        process.exit(1);
    }
}

reproduce();
