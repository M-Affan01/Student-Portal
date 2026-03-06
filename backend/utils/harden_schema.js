const db = require('../config/db');

async function hardenSchema() {
    try {
        console.log('Cleaning orphans...');
        await db.query('DELETE FROM course_registrations WHERE student_id NOT IN (SELECT student_id FROM students)');
        await db.query('DELETE FROM student_courses WHERE student_id NOT IN (SELECT student_id FROM students)');
        await db.query('DELETE FROM course_registrations WHERE course_id NOT IN (SELECT course_id FROM courses)');
        await db.query('DELETE FROM student_courses WHERE course_id NOT IN (SELECT course_id FROM courses)');
        console.log('Orphans cleaned.');

        console.log('Adding Foreign Keys to course_registrations...');
        try {
            await db.query('ALTER TABLE course_registrations ADD CONSTRAINT fk_reg_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE');
            console.log('Added student FK to course_registrations');
        } catch (e) { console.log('course_registrations student FK error:', e.message); }

        try {
            await db.query('ALTER TABLE course_registrations ADD CONSTRAINT fk_reg_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE');
            console.log('Added course FK to course_registrations');
        } catch (e) { console.log('course_registrations course FK error:', e.message); }

        console.log('Adding Foreign Keys to student_courses...');
        try {
            await db.query('ALTER TABLE student_courses ADD CONSTRAINT fk_sc_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE');
            console.log('Added student FK to student_courses');
        } catch (e) { console.log('student_courses student FK error:', e.message); }

        try {
            await db.query('ALTER TABLE student_courses ADD CONSTRAINT fk_sc_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE');
            console.log('Added course FK to student_courses');
        } catch (e) { console.log('student_courses course FK error:', e.message); }

        process.exit(0);
    } catch (err) {
        console.error('Schema Hardening FAILED:', err);
        process.exit(1);
    }
}

hardenSchema();
