const db = require('../config/db');

async function syncData() {
    try {
        console.log('Starting Sync...');

        // Fetch registrations that are NOT in student_courses
        const [missing] = await db.query(`
            SELECT r.*, c.course_name, c.semester_number, s.current_semester, s.roll_number, s.full_name
            FROM course_registrations r
            JOIN courses c ON r.course_id = c.course_id
            JOIN students s ON r.student_id = s.student_id
            LEFT JOIN student_courses sc ON r.student_id = sc.student_id AND r.course_id = sc.course_id
            WHERE r.status = 'Registered' AND sc.id IS NULL
        `);

        console.log(`Found ${missing.length} missing entries to sync.`);

        let added = 0;
        for (const m of missing) {
            await db.query(`
                INSERT INTO student_courses 
                (student_id, roll_number, full_name, course_id, course_name, student_semester, course_semester, academic_year, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    m.student_id,
                    m.roll_number,
                    m.full_name,
                    m.course_id,
                    m.course_name,
                    m.current_semester || 1,
                    m.semester_number || 1,
                    '2025',
                    'active'
                ]
            );
            added++;
        }

        console.log(`Sync Complete. Added ${added} missing records.`);
        process.exit(0);
    } catch (err) {
        console.error('Sync FAILED:', err);
        process.exit(1);
    }
}

syncData();
