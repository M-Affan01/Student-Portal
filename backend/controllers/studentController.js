const db = require('../config/db');
const bcrypt = require('bcryptjs');

// @desc    Get Student Dashboard Stats
// @route   GET /api/student/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const studentId = req.user.id;

        // 1. Get Basic Info
        const [student] = await db.query('SELECT current_semester, total_credits FROM students WHERE student_id = ?', [studentId]);

        // 1b. Calculate Dynamic CGPA (Weighted by Credit Hours)
        const [cgpaResult] = await db.query(`
            SELECT SUM(ah.grade_point * c.credit_hours) / SUM(c.credit_hours) as calculated_cgpa
            FROM academic_history ah
            JOIN courses c ON ah.course_id = c.course_id
            WHERE ah.student_id = ?
        `, [studentId]);

        const currentCgpa = parseFloat(cgpaResult[0].calculated_cgpa || 0).toFixed(2);

        // 2. Get Pending Fees
        const [fees] = await db.query('SELECT SUM(amount) as pending_fees FROM fees WHERE student_id = ? AND status = "Pending"', [studentId]);

        // 3. Get Registered Courses Count & Current Semester Credits
        const [registrations] = await db.query(`
            SELECT COUNT(*) as count, SUM(c.credit_hours) as current_credits
            FROM course_registrations r
            JOIN courses c ON r.course_id = c.course_id
            WHERE r.student_id = ? AND r.status = 'Registered'
        `, [studentId]);

        // 4. Get Notifications (Unread)
        const [notifications] = await db.query('SELECT * FROM notifications WHERE (student_id = ? OR student_id IS NULL) AND is_read = 0 ORDER BY created_at DESC LIMIT 5', [studentId]);

        // 5. Generate Dynamic Notifications
        const dynamicNotifications = [];

        // Fee Warning
        const pendingFeeAmount = fees[0].pending_fees || 0;
        if (pendingFeeAmount > 0) {
            dynamicNotifications.push({
                notification_id: 'fee-alert',
                title: 'Finance Alert: Payment Pending',
                message: `You have $${pendingFeeAmount} in pending fees. Please clear them to avoid late surcharges.`,
                type: 'Administrative',
                is_urgent: true
            });
        }

        // Registration Alert
        const registeredCount = registrations[0].count || 0;
        if (registeredCount === 0) {
            dynamicNotifications.push({
                notification_id: 'reg-alert',
                title: 'Academic Alert: Not Registered',
                message: 'You haven\'t enrolled in any courses for the current semester. Register now to avoid academic plan delays.',
                type: 'Academic',
                is_urgent: true
            });
        }

        // 6. Get CGPA History
        const [gpaHistory] = await db.query(`
            SELECT semester, AVG(grade_point) as gpa 
            FROM academic_history 
            WHERE student_id = ? 
            GROUP BY semester 
            ORDER BY semester ASC
        `, [studentId]);

        // 7. Calculate Dynamic Attendance Percentage
        const [attendanceResult] = await db.query(`
            SELECT 
                COUNT(*) as total_classes,
                SUM(CASE WHEN status IN ('Present', 'Late') THEN 1 ELSE 0 END) as attended_classes
            FROM attendance
            WHERE student_id = ?
        `, [studentId]);

        const totalClasses = attendanceResult[0].total_classes || 0;
        const attendedClasses = attendanceResult[0].attended_classes || 0;
        const attendancePercentage = totalClasses > 0
            ? Math.round((attendedClasses / totalClasses) * 100) + '%'
            : '100%';

        res.json({
            cgpa: currentCgpa,
            credits: registrations[0].current_credits || 0,
            totalEarnedCredits: student[0].total_credits,
            semester: student[0].current_semester,
            attendance: attendancePercentage,
            pendingFees: pendingFeeAmount,
            registeredCourses: registrations[0].count,
            notifications: [...dynamicNotifications, ...notifications],
            cgpaHistory: gpaHistory
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Academic History
// @route   GET /api/student/history
// @access  Private
const getAcademicHistory = async (req, res) => {
    try {
        const studentId = req.user.id;
        const [history] = await db.query(`
            SELECT 
                ah.semester, 
                c.course_code, 
                c.course_name as course_title, 
                c.credit_hours as credits,
                ah.grade,
                ah.grade_point
            FROM academic_history ah
            JOIN courses c ON ah.course_id = c.course_id
            WHERE ah.student_id = ?
            ORDER BY ah.semester DESC
        `, [studentId]);

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... (Rest of the file remains same, I'll just write the whole thing to be safe as it's a critical controller)
// Actually I'll use replace for the remaining parts to avoid character limit issues if the file grows.
// Let's just finish the file here with the remaining functions.

const getFees = async (req, res) => {
    try {
        const [fees] = await db.query('SELECT * FROM fees WHERE student_id = ? ORDER BY due_date ASC', [req.user.id]);
        res.json(fees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const payFee = async (req, res) => {
    try {
        const studentIdFromAuth = req.user.id;
        const { cardEnding, transactionId } = req.body || {};
        const today = new Date().toISOString().slice(0, 10);
        const [students] = await db.query('SELECT student_id, full_name, roll_number FROM students WHERE student_id = ?', [studentIdFromAuth]);
        if (students.length === 0) return res.status(404).json({ message: 'Student not found.' });
        const s = students[0];
        const [pending] = await db.query('SELECT * FROM fees WHERE student_id = ? AND status != ?', [s.student_id, 'Paid']);
        const actualPending = pending.filter(p => p.status === 'Pending' || p.status === 'Overdue');
        if (actualPending.length === 0) return res.status(400).json({ message: 'No pending fees found.' });
        const totalAmount = actualPending.reduce((sum, fee) => sum + Number(fee.amount), 0);
        const finalTxId = transactionId || 'TXN-' + Math.floor(Math.random() * 1000000000);
        const finalCardEnding = cardEnding || '0000';
        await db.query('INSERT INTO payments (student_id, student_name, amount, transaction_id, payment_date, card_ending) VALUES (?, ?, ?, ?, ?, ?)', [s.student_id, s.full_name, totalAmount, finalTxId, today, finalCardEnding]);
        for (const fee of actualPending) {
            await db.query('UPDATE fees SET status = ? WHERE fee_id = ?', ['Cleared', fee.fee_id]);
            await db.query('INSERT INTO fees (student_id, full_name, roll_number, amount, due_date, status, description, payment_date, transaction_id, card_ending) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [s.student_id, s.full_name, s.roll_number, fee.amount, fee.due_date, 'Paid', fee.description, today, finalTxId, finalCardEnding]);
        }
        res.json({ message: 'Payment Successful', transactionId: finalTxId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment failed' });
    }
}

const getTimetable = async (req, res) => {
    try {
        const q = `
            SELECT t.*, c.course_code, c.course_name, tc.teacher_name as instructor_name
            FROM timetable t
            JOIN courses c ON t.course_id = c.course_id
            JOIN course_registrations r ON c.course_id = r.course_id
            LEFT JOIN teacher_courses tc ON c.course_id = tc.course_id AND tc.is_active = 1
            WHERE r.student_id = ? AND r.status = 'Registered'
            ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), t.start_time
        `;
        const [timetable] = await db.query(q, [req.user.id]);
        res.json(timetable);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { email, phone } = req.body;
        await db.query('UPDATE students SET email = ?, phone = ? WHERE student_id = ?', [email, phone, req.user.id]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const filePath = `uploads/profile_pics/${req.file.filename}`;
        await db.query('UPDATE students SET profile_image = ? WHERE student_id = ?', [filePath, req.user.id]);
        res.json({ message: 'Profile picture uploaded successfully', filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const [users] = await db.query('SELECT password_hash FROM students WHERE student_id = ?', [req.user.id]);
        const user = users[0];
        let isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch && oldPassword === user.password_hash) isMatch = true;
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await db.query('UPDATE students SET password_hash = ? WHERE student_id = ?', [hashedPassword, req.user.id]);
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    getDashboardStats,
    getAcademicHistory,
    getFees,
    getTimetable,
    payFee,
    updateProfile,
    updatePassword,
    uploadProfilePic
};
