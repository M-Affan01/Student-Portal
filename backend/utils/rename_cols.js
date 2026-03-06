const db = require('../config/db');

async function renameCols() {
    try {
        console.log('Renaming columns in course_registrations...');
        try {
            await db.query('ALTER TABLE course_registrations CHANGE COLUMN student_name full_name VARCHAR(100)');
            console.log('Renamed student_name to full_name in course_registrations');
        } catch (e) { console.log('course_registrations: might already be full_name'); }

        console.log('Renaming columns in student_courses...');
        try {
            await db.query('ALTER TABLE student_courses CHANGE COLUMN student_name full_name VARCHAR(100)');
            console.log('Renamed student_name to full_name in student_courses');
        } catch (e) { console.log('student_courses: might already be full_name'); }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

renameCols();
