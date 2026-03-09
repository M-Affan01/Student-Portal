const db = require('../config/db');

// @desc    Get All Available Courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
    try {
        const q = `
            SELECT c.*, d.department_code, tc.teacher_name as current_instructor
            FROM courses c
            JOIN departments d ON c.department_id = d.department_id
            LEFT JOIN (
                SELECT course_id, ANY_VALUE(teacher_name) as teacher_name 
                FROM teacher_courses 
                WHERE is_active = 1
                GROUP BY course_id
            ) tc ON c.course_id = tc.course_id
        `;
        const [courses] = await db.query(q);
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register for a Course
// @route   POST /api/courses/register
// @access  Private
const registerCourse = async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user.id;
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Check if course exists
        const [course] = await connection.query('SELECT * FROM courses WHERE course_id = ?', [courseId]);
        if (course.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Course not found' });
        }
        const courseData = course[0];

        // 2. Check if already registered
        const [existing] = await connection.query('SELECT * FROM course_registrations WHERE student_id = ? AND course_id = ? FOR UPDATE', [studentId, courseId]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Already registered for this course' });
        }

        // 3. Check credits (Frontend already checks, but backend must too)
        const [creditSum] = await connection.query('SELECT SUM(c.credit_hours) as total FROM course_registrations cr JOIN courses c ON cr.course_id = c.course_id WHERE cr.student_id = ? AND cr.status = \'Registered\'', [studentId]);
        const currentCredits = parseInt(creditSum[0].total || 0);
        if (currentCredits + courseData.credit_hours > 21) {
            await connection.rollback();
            return res.status(400).json({ message: 'Credit hour limit (21) exceeded' });
        }


        // 4. Get Student Info
        const [student] = await connection.query('SELECT full_name, roll_number FROM students WHERE student_id = ?', [studentId]);

        // 5. Insert Registration
        await connection.query(
            'INSERT INTO course_registrations (student_id, course_id, semester, full_name, roll_number) VALUES (?, ?, ?, ?, ?)',
            [studentId, courseId, courseData.semester_number, student[0].full_name, student[0].roll_number]
        );

        // 6. Insert into student_courses (Legacy support)
        await connection.query(
            'INSERT INTO student_courses (student_id, roll_number, full_name, course_id, course_name, student_semester, course_semester, academic_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [studentId, student[0].roll_number, student[0].full_name, courseId, courseData.course_name, courseData.semester_number, courseData.semester_number, '2025']
        );

        // 7. Generate Fee for the Course ($150 per credit hour)
        const feeAmount = courseData.credit_hours * 150;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days
        const dueDateStr = dueDate.toISOString().slice(0, 10);

        await connection.query(
            'INSERT INTO fees (student_id, full_name, roll_number, amount, due_date, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [studentId, student[0].full_name, student[0].roll_number, feeAmount, dueDateStr, 'Pending', `Registration Fee: ${courseData.course_name} (${courseData.course_code})`]
        );

        await connection.commit();
        res.json({ message: 'Course registered successfully' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('REG ERROR:', error);
        res.status(500).json({ message: 'Server Error', details: error.message, stack: error.stack });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Drop a Course
// @route   DELETE /api/courses/:id
// @access  Private
const dropCourse = async (req, res) => {
    const courseId = req.params.id;
    const studentId = req.user.id;
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query('DELETE FROM course_registrations WHERE student_id = ? AND course_id = ?', [studentId, courseId]);
        await connection.query('DELETE FROM student_courses WHERE student_id = ? AND course_id = ?', [studentId, courseId]);

        await connection.commit();
        res.json({ message: 'Course dropped successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Get My Registered Courses
// @route   GET /api/courses/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
    try {
        const studentId = req.user.id;
        const [courses] = await db.query(`
            SELECT c.*, r.status, ANY_VALUE(tc.teacher_name) as instructor_name
            FROM course_registrations r
            JOIN courses c ON r.course_id = c.course_id
            LEFT JOIN teacher_courses tc ON c.course_id = tc.course_id AND tc.is_active = 1
            WHERE r.student_id = ? AND r.status = 'Registered'
            GROUP BY c.course_id, r.status
        `, [studentId]);
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCourses,
    registerCourse,
    dropCourse,
    getMyCourses
};
