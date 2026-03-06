const db = require('../config/db');

async function testInsert() {
    try {
        console.log('Attempting manual insert into student_courses...');
        const [result] = await db.query(`
            INSERT INTO student_courses 
            (student_id, roll_number, full_name, course_id, course_name, student_semester, course_semester, academic_year, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [6, 'ROLL006', 'Ezaz Ika', 1, 'Test Course', 1, 1, '2025', 'active']
        );
        console.log('Insert successful, ID:', result.insertId);

        // Cleanup
        await db.query('DELETE FROM student_courses WHERE id = ?', [result.insertId]);
        console.log('Cleanup successful');

        process.exit(0);
    } catch (err) {
        console.error('Insert FAILED:', err);
        process.exit(1);
    }
}

testInsert();
