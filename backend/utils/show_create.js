const db = require('../config/db');

async function showCreate() {
    try {
        console.log('--- CREATE TABLE students ---');
        const [s] = await db.query('SHOW CREATE TABLE students');
        console.log(s[0]['Create Table']);

        console.log('\n--- CREATE TABLE course_registrations ---');
        const [r] = await db.query('SHOW CREATE TABLE course_registrations');
        console.log(r[0]['Create Table']);

        console.log('\n--- CREATE TABLE student_courses ---');
        const [sc] = await db.query('SHOW CREATE TABLE student_courses');
        console.log(sc[0]['Create Table']);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

showCreate();
