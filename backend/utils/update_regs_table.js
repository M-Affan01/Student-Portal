const db = require('../config/db');

async function updateSchema() {
    try {
        console.log('Adding columns to course_registrations...');

        // Check if columns exist first (to make script idempotent)
        // Or just try ADD and catch error.

        try {
            await db.query('ALTER TABLE course_registrations ADD COLUMN student_name VARCHAR(100)');
            console.log('Added student_name');
        } catch (e) { console.log('student_name might already exist'); }

        try {
            await db.query('ALTER TABLE course_registrations ADD COLUMN roll_number VARCHAR(20)');
            console.log('Added roll_number');
        } catch (e) { console.log('roll_number might already exist'); }

        console.log('Schema update complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateSchema();
