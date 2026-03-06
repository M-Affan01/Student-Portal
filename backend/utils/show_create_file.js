const db = require('../config/db');
const fs = require('fs');

async function showCreate() {
    try {
        let output = '';

        const [s] = await db.query('SHOW CREATE TABLE students');
        output += '--- CREATE TABLE students ---\n' + s[0]['Create Table'] + '\n\n';

        const [r] = await db.query('SHOW CREATE TABLE course_registrations');
        output += '--- CREATE TABLE course_registrations ---\n' + r[0]['Create Table'] + '\n\n';

        const [sc] = await db.query('SHOW CREATE TABLE student_courses');
        output += '--- CREATE TABLE student_courses ---\n' + sc[0]['Create Table'] + '\n\n';

        fs.writeFileSync('schema_snapshot.txt', output);
        console.log('Schema written to schema_snapshot.txt');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

showCreate();
