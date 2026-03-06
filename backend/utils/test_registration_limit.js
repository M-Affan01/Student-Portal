const db = require('../config/db');
const axios = require('axios'); // We might need to mock request or just call controller function directly?
// Creating a standalone script that calls DB directly seems easier to simulate state, 
// but calling the API via axios would test the full stack including middleware.
// Let's use direct DB manipulation for setup/teardown and call the Logic via functions if possible, 
// OR just use axios against localhost:5000 if server is running.
// Server IS running. Let's use axios.

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let studentId = 0;
let courseIds = [];

async function loginOrRegister() {
    // 1. Create Test Student
    const email = `limit_test_${Date.now()}@test.com`;
    const password = 'password123';

    // Register directly in DB to avoid API complexities or use API
    // Let's use DB for setup to be sure
    const [res] = await db.query(
        'INSERT INTO students (roll_number, full_name, email, password_hash, total_credits) VALUES (?, ?, ?, ?, ?)',
        [`L-${Date.now()}`, 'Limit Tester', email, '$2a$10$abcdefg...', 0] // Mock hash
    );
    studentId = res.insertId;
    console.log(`Created Test Student: ${studentId} (${email})`);

    // We need a valid token. Since we mocked the hash, we can't login easily unless we know the hash source.
    // Easier to just generate a token using jsonwebtoken if we have the secret.
    // Let's rely on the fact we can inject a mock req object if we import the controller?
    // No, better to stick to DB state verification. 
    // Wait, the controller logic IS what we want to test. 
    // Let's import the controller and mock req/res. 
}

const { registerCourse } = require('../controllers/courseController');

async function testLogic() {
    try {
        console.log("--- Starting Verification ---");

        // 1. Setup Data
        await db.query('DELETE FROM students WHERE email LIKE "limit_test_%"');
        const email = `limit_test_${Date.now()}@test.com`;
        const [sRes] = await db.query(
            'INSERT INTO students (roll_number, full_name, email, password_hash) VALUES (?, ?, ?, ?)',
            [`L-${Date.now()}`, 'Limit Tester', email, 'hash']
        );
        studentId = sRes.insertId;

        // Create 3 courses: 10 credits, 10 credits, 2 credits.
        const c1Code = `C1-${Date.now()}`;
        const c2Code = `C2-${Date.now()}`;
        const c3Code = `C3-${Date.now()}`;

        const [c1] = await db.query('INSERT INTO courses (course_code, course_name, credit_hours) VALUES (?, ?, ?)', [c1Code, 'Course 10A', 10]);
        const [c2] = await db.query('INSERT INTO courses (course_code, course_name, credit_hours) VALUES (?, ?, ?)', [c2Code, 'Course 10B', 10]);
        const [c3] = await db.query('INSERT INTO courses (course_code, course_name, credit_hours) VALUES (?, ?, ?)', [c3Code, 'Course 2A', 2]);

        const id1 = c1.insertId;
        const id2 = c2.insertId;
        const id3 = c3.insertId;

        console.log(`Created Courses: ${id1} (10cr), ${id2} (10cr), ${id3} (2cr)`);

        // 2. Perform Registration Mocking
        const mockRes = () => {
            return {
                status: (code) => ({
                    json: (data) => console.log(`[RES ${code}]`, data)
                }),
                json: (data) => console.log(`[RES 200]`, data)
            };
        };

        // Helper wrapper
        const callRegister = async (cid) => {
            const req = {
                body: { courseId: cid },
                user: { id: studentId }
            };
            const res = {
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (data) {
                    this.data = data;
                    return this;
                }
            };
            await registerCourse(req, res);
            return res;
        };

        console.log("\nAttempt 1: Register 10 credits...");
        let r1 = await callRegister(id1);
        if (r1.statusCode === 201) console.log("SUCCESS");
        else console.log("FAILED", r1.data);

        console.log("\nAttempt 2: Register 10 credits (Total 20)...");
        let r2 = await callRegister(id2);
        if (r2.statusCode === 201) console.log("SUCCESS");
        else console.log("FAILED", r2.data);

        console.log("\nAttempt 3: Register 2 credits (Total 22 - Should FAIL)...");
        let r3 = await callRegister(id3);
        if (r3.statusCode === 400 && r3.data.message.includes('Credit limit exceeded')) {
            console.log("SUCCESS: Blocked correctly.");
        } else {
            console.log("FAILURE: Create limit NOT enforced!", r3.statusCode, r3.data);
        }

        // 3. Verify student_courses table
        const [rows] = await db.query('SELECT * FROM student_courses WHERE student_id = ?', [studentId]);
        console.log(`\nEntries in student_courses: ${rows.length} (Expected 2)`);
        rows.forEach(r => console.log(` - ${r.course_name} (${r.status})`));

        // Cleanup
        await db.query('DELETE FROM students WHERE student_id = ?', [studentId]);
        await db.query('DELETE FROM courses WHERE course_id IN (?, ?, ?)', [id1, id2, id3]);
        await db.query('DELETE FROM student_courses WHERE student_id = ?', [studentId]);
        await db.query('DELETE FROM course_registrations WHERE student_id = ?', [studentId]);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testLogic();
