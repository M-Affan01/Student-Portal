/**
 * repair_data.js
 * Seeds course_registrations, fees, and attendance for existing students.
 * Safe to run multiple times — deletes existing data and re-inserts.
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function repairData() {
    const config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    };

    if (process.env.DB_CA_PATH) {
        try {
            config.ssl = { ca: fs.readFileSync(path.resolve(process.env.DB_CA_PATH)) };
        } catch (e) { console.error('SSL Error:', e.message); }
    }

    const conn = await mysql.createConnection(config);
    console.log('Connected to Aiven Cloud...');

    try {
        // Get students
        const [students] = await conn.query('SELECT student_id, roll_number, full_name FROM students');
        console.log(`Found ${students.length} students.`);

        // Clear old data
        await conn.query('DELETE FROM fees');
        await conn.query('DELETE FROM course_registrations');
        await conn.query('DELETE FROM attendance');
        console.log('Old data cleared.');

        const today = new Date();
        const dueDate = new Date(today.getFullYear(), today.getMonth() + 1, 15).toISOString().slice(0, 10);

        for (const student of students) {
            const { student_id, roll_number, full_name } = student;
            // Assign 5 courses per student (based on semester 1 and 2 courses)
            const courseIds = [1, 2, 3, 4, 5]; // CS101, CS203, CS209, CS215, CS301

            for (const courseId of courseIds) {
                // Get credit hours for fee calculation
                const [courses] = await conn.query('SELECT credit_hours FROM courses WHERE course_id = ?', [courseId]);
                const creditHours = courses[0]?.credit_hours || 3;
                const feeAmount = creditHours * 150;

                // Insert course registration
                await conn.query(
                    'INSERT INTO course_registrations (student_id, course_id, full_name, roll_number, status) VALUES (?, ?, ?, ?, ?)',
                    [student_id, courseId, full_name, roll_number, 'Registered']
                );

                // Insert fee record
                await conn.query(
                    `INSERT INTO fees (student_id, full_name, roll_number, amount, due_date, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [student_id, full_name, roll_number, feeAmount, dueDate, 'Pending', `Tuition Fee - Course #${courseId} (${creditHours} credit hours)`]
                );

                // Insert sample attendance (3 classes per course, 2 present 1 absent)
                const days = ['Monday', 'Wednesday', 'Friday'];
                for (let i = 0; i < days.length; i++) {
                    const status = i < 2 ? 'Present' : 'Absent';
                    await conn.query(
                        'INSERT INTO attendance (student_id, course_id, date, status) VALUES (?, ?, CURDATE(), ?)',
                        [student_id, courseId, status]
                    );
                }
            }

            console.log(`Registered 5 courses + fees + attendance for: ${full_name} (${roll_number})`);
        }

        // Seed academic history if empty
        const [histCheck] = await conn.query('SELECT COUNT(*) as c FROM academic_history');
        if (histCheck[0].c === 0) {
            for (const student of students) {
                await conn.query(`
                    INSERT INTO academic_history (student_id, course_id, semester, grade, grade_point) VALUES
                    (?, 1, 1, 'A', 4.0),
                    (?, 2, 1, 'B+', 3.5),
                    (?, 3, 2, 'A-', 3.7),
                    (?, 4, 2, 'B', 3.0)
                `, [student.student_id, student.student_id, student.student_id, student.student_id]);
                console.log(`Seeded academic history for: ${student.full_name}`);
            }
        } else {
            console.log('Academic history already has data, skipping...');
        }

        console.log('\n✅ Database repair complete! Dashboard should now load data.');
    } catch (e) {
        console.error('❌ Repair error:', e.message);
    } finally {
        await conn.end();
    }
}

repairData();
