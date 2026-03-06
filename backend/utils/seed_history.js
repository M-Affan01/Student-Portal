const db = require('../config/db');

const seedHistory = async () => {
    try {
        const studentId = 1;
        console.log(`Seeding academic history for Student ID ${studentId}...`);

        // Check if history already exists to avoid duplicates
        const [existing] = await db.query('SELECT * FROM academic_history WHERE student_id = ?', [studentId]);
        if (existing.length > 0) {
            console.log("History already exists. Skipping.");
            process.exit(0);
        }

        // Add 3 semesters of history
        const historyData = [
            [studentId, 1, 1, 'A-', 3.67, '2023-01-15'],
            [studentId, 2, 1, 'B+', 3.33, '2023-01-15'],
            [studentId, 3, 2, 'A', 4.00, '2023-06-15'],
            [studentId, 4, 2, 'A-', 3.67, '2023-06-15'],
            [studentId, 5, 3, 'B', 3.00, '2023-12-15'],
            [studentId, 6, 3, 'B+', 3.33, '2023-12-15']
        ];

        for (const record of historyData) {
            await db.query(`
                INSERT INTO academic_history (student_id, course_id, semester, grade, grade_point, completion_date)
                VALUES (?, ?, ?, ?, ?, ?)
            `, record);
        }

        console.log("Academic history seeded successfully! Graph will now show real trends.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err.message);
        process.exit(1);
    }
};

seedHistory();
