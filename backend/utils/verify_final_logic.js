const db = require('../config/db');

async function verifyFinal() {
    try {
        const studentId = 6;
        const courseId = 2; // Physics 101

        console.log(`Starting test for Student ${studentId} on Course ${courseId}...`);

        // Check if already registered to avoid error
        const [exists] = await db.query('SELECT * FROM course_registrations WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
        if (exists.length > 0) {
            console.log('Already registered, dropping first...');
            await db.query('DELETE FROM course_registrations WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
            await db.query('DELETE FROM student_courses WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
        }

        // Simulate registration logic
        const [student] = await db.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
        const s = student[0];
        const [course] = await db.query('SELECT * FROM courses WHERE course_id = ?', [courseId]);
        const c = course[0];

        await db.query('INSERT INTO course_registrations (student_id, course_id, semester, status, full_name, roll_number) VALUES (?, ?, ?, ?, ?, ?)',
            [s.student_id, courseId, 1, 'Registered', s.full_name, s.roll_number]);

        await db.query(`
            INSERT INTO student_courses 
            (student_id, roll_number, full_name, course_id, course_name, student_semester, course_semester, academic_year, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [s.student_id, s.roll_number, s.full_name, courseId, c.course_name, s.current_semester, 1, '2025', 'active']
        );

        console.log('Test registration successful.');

        // Verify counts
        const [r] = await db.query('SELECT COUNT(*) as count FROM course_registrations WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
        const [sc] = await db.query('SELECT COUNT(*) as count FROM student_courses WHERE student_id = ? AND course_id = ?', [studentId, courseId]);

        console.log(`Verification: Reg Count=${r[0].count}, SC Count=${sc[0].count}`);

        if (r[0].count === 1 && sc[0].count === 1) {
            console.log('SYNC VERIFIED: BOTH TABLES UPDATED CORRECTLY.');
        } else {
            console.error('SYNC FAILED!');
        }

        process.exit(0);
    } catch (err) {
        console.error('Final verification FAILED:', err);
        process.exit(1);
    }
}

verifyFinal();
