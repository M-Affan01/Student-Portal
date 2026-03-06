const db = require('../config/db');

async function updateFeesTable() {
    try {
        console.log('Adding columns to fees table...');

        try {
            await db.query('ALTER TABLE fees ADD COLUMN full_name VARCHAR(100) AFTER student_id');
            console.log('Added full_name to fees');
        } catch (e) { console.log('full_name already exists or error:', e.message); }

        try {
            await db.query('ALTER TABLE fees ADD COLUMN roll_number VARCHAR(20) AFTER full_name');
            console.log('Added roll_number to fees');
        } catch (e) { console.log('roll_number already exists or error:', e.message); }

        console.log('Syncing fee metadata from students table...');
        await db.query(`
            UPDATE fees f
            JOIN students s ON f.student_id = s.student_id
            SET f.full_name = s.full_name, f.roll_number = s.roll_number
        `);
        console.log('Metadata synced.');

        console.log('Cleaning orphan fees...');
        await db.query('DELETE FROM fees WHERE student_id NOT IN (SELECT student_id FROM students)');
        console.log('Orphan fees cleaned.');

        console.log('Adding Foreign Key to fees table...');
        try {
            await db.query('ALTER TABLE fees ADD CONSTRAINT fk_fees_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE');
            console.log('Added student FK to fees');
        } catch (e) { console.log('fees student FK already exists or error:', e.message); }

        process.exit(0);
    } catch (err) {
        console.error('Update FAILED:', err);
        process.exit(1);
    }
}

updateFeesTable();
