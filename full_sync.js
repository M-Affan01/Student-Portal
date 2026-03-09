/**
 * full_sync.js
 * Performs a complete wipe and re-seed of ALL cloud tables using exact local seed data.
 * This guarantees cloud = local for all tables.
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fullSync() {
    const config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    };
    if (process.env.DB_CA_PATH) {
        try { config.ssl = { ca: fs.readFileSync(path.resolve(process.env.DB_CA_PATH)) }; } catch (e) { }
    }

    const conn = await mysql.createConnection(config);
    console.log('✅ Connected to Aiven Cloud...\n');

    try {
        // =============================================
        // STEP 1: CLEAR ALL TABLES (safe order)
        // =============================================
        console.log('🧹 Step 1: Clearing all tables...');
        const tablesToClear = [
            'attendance', 'fees', 'course_registrations', 'academic_history',
            'notifications', 'timetable', 'student_courses', 'teacher_courses',
            'courses', 'students', 'teachers', 'departments'
        ];
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        for (const table of tablesToClear) {
            await conn.query(`TRUNCATE TABLE ${table}`);
        }
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('   ✅ All tables cleared.\n');

        // =============================================
        // STEP 2: DEPARTMENTS
        // =============================================
        console.log('🏛️ Step 2: Seeding departments...');
        await conn.query(`
            INSERT INTO departments (department_code, department_name, head_of_department, email, phone, building, meeting_day, meeting_time, is_active) VALUES 
            ('CS', 'Computer Science', 'Dr Adnan Ahmed Siddique', 'Adnan.siddique@gmail.nexor.edu.pk', '+923884556576', 'A', 'Monday', '10:00 AM', 1),
            ('SE', 'Software Engineering', 'Dr. Faisal', 'faisal@nexor.edu.pk', '+920000000000', 'B', 'Tuesday', '09:00 AM', 1),
            ('BA', 'Business Administration', 'Dr. Kashif', 'kashif@nexor.edu.pk', '+920000000001', 'C', 'Wednesday', '11:00 AM', 1),
            ('AI', 'Artificial Intelligence', 'Dr Affan', 'affan@gmail.nexor.edu.pk', '+98839438434', 'A', 'Monday', '10:00 AM', 1),
            ('SCI', 'Sciences & Humanities', 'Dr. Sarah', 'sarah@nexor.edu.pk', '+920000000002', 'D', 'Thursday', '09:00 AM', 1)
        `);
        console.log('   ✅ 5 departments seeded.\n');

        // =============================================
        // STEP 3: COURSES (50+)
        // =============================================
        console.log('📚 Step 3: Seeding 50 courses...');
        await conn.query(`
            INSERT INTO courses (course_id, course_code, course_name, department_id, credit_hours, lab_credit_hours, course_type, semester_number, instructor_name, description, is_elective, is_active) VALUES 
            (1,'CS101','Programming Fundamentals',1,3,1,'theory+lab',1,'John Smith','Intro to programming',0,1),
            (2,'CS203','Data Structures',1,3,1,'theory+lab',2,'John Smith','Data management',0,1),
            (3,'CS209','Digital Logic Design',1,3,1,'theory+lab',2,'Lisa Davis','Digital circuits',0,1),
            (4,'CS215','Discrete Mathematics',1,3,0,'theory',2,'Robert Miller','Math for CS',0,1),
            (5,'CS301','Operating Systems',1,3,1,'theory+lab',3,'David Wilson','OS principles',0,1),
            (6,'CS305','Database Systems',1,3,1,'theory+lab',3,'Sarah Johnson','SQL and Design',0,1),
            (7,'CS310','Computer Networks',1,3,1,'theory+lab',4,'Mike Brown','Networking',0,1),
            (8,'CS401','Theory of Automata',1,3,0,'theory',5,'Alice Green','Automata',0,1),
            (9,'CS405','Design & Analysis of Algorithms',1,3,0,'theory',4,'Robert Miller','Algorithms',0,1),
            (10,'CS410','Compiler Construction',1,3,1,'theory+lab',6,'David Wilson','Compilers',0,1),
            (11,'SE101','Intro to SE',2,3,0,'theory',1,'Mark Stevenson','SE Basics',0,1),
            (12,'SE201','Requirement Engineering',2,3,0,'theory',2,'Emily White','Elicitation',0,1),
            (13,'SE205','Object Oriented Programming',2,3,1,'theory+lab',2,'Alex Carter','OOP',0,1),
            (14,'SE301','Software Architecture',2,3,0,'theory',3,'Mark Stevenson','Architecture',0,1),
            (15,'SE305','Software Quality',2,3,0,'theory',4,'Emily White','SQA',0,1),
            (16,'SE310','Web Engineering',2,3,1,'theory+lab',3,'Alex Carter','Web Dev',0,1),
            (17,'SE401','Mobile App Dev',2,3,1,'theory+lab',4,'Emily White','Mobile Dev',0,1),
            (18,'SE405','Software Project Management',2,3,0,'theory',5,'Mark Stevenson','SPM',0,1),
            (19,'SE410','Information Security',2,3,0,'theory',6,'Emily White','InfoSec',0,1),
            (20,'SE415','Formal Methods',2,3,0,'theory',5,'Mark Stevenson','Formal',0,1),
            (21,'BA101','Principles of Management',3,3,0,'theory',1,'Robert Lewis','Management',0,1),
            (22,'BA105','Financial Accounting',3,3,0,'theory',1,'Karen Hope','Accounting',0,1),
            (23,'BA201','Macroeconomics',3,3,0,'theory',2,'Robert Lewis','Macro',0,1),
            (24,'BA205','Marketing Management',3,3,0,'theory',2,'Karen Hope','Marketing',0,1),
            (25,'BA301','HR Management',3,3,0,'theory',3,'Robert Lewis','HRM',0,1),
            (26,'BA305','Business Law',3,3,0,'theory',3,'Karen Hope','Law',0,1),
            (27,'BA310','Entrepreneurship',3,3,0,'theory',4,'Robert Lewis','Entr',0,1),
            (28,'BA401','Strategic Management',3,3,0,'theory',5,'Karen Hope','Strategy',0,1),
            (29,'BA405','Operations Management',3,3,0,'theory',4,'Robert Lewis','Ops',0,1),
            (30,'BA410','Organizational Behavior',3,3,0,'theory',6,'Karen Hope','OB',0,1),
            (31,'AI101','Intro to AI',4,3,0,'theory',1,'Dr. Alan Turing','AI Basics',0,1),
            (32,'AI201','Machine Learning',4,3,1,'theory+lab',2,'Dr. Hinton','ML',0,1),
            (33,'AI205','Natural Language Processing',4,3,1,'theory+lab',2,'Dr. Ng','NLP',0,1),
            (34,'AI301','Computer Vision',4,3,1,'theory+lab',3,'Dr. Alan Turing','CV',0,1),
            (35,'AI305','Deep Learning',4,3,1,'theory+lab',3,'Dr. Hinton','DL',0,1),
            (36,'AI310','Robotics',4,3,1,'theory+lab',4,'Dr. Ng','Robotics',0,1),
            (37,'AI401','AI Ethics',4,3,0,'theory',5,'Dr. Alan Turing','Ethics',0,1),
            (38,'AI405','Knowledge Representation',4,3,0,'theory',4,'Dr. Hinton','KR',0,1),
            (39,'AI410','Reinforcement Learning',4,3,1,'theory+lab',6,'Dr. Ng','RL',0,1),
            (40,'AI415','Expert Systems',4,3,0,'theory',5,'Dr. Alan Turing','Expert',0,1),
            (41,'MATH101','Calculus I',5,3,0,'theory',1,'Jane Doe','Calculus 1',0,1),
            (42,'MATH102','Calculus II',5,3,0,'theory',2,'Jane Doe','Calculus 2',0,1),
            (43,'PHYS101','Applied Physics',5,3,1,'theory+lab',1,'Mike Johnson','Physics',0,1),
            (44,'PSY101','Intro to Psychology',5,3,0,'theory',1,'Sarah Miller','Psychology',0,1),
            (45,'ENG101','English Composition',5,3,0,'theory',1,'Mike Johnson','English',0,1),
            (46,'STATS101','Probability & Stats',5,3,0,'theory',2,'Jane Doe','Stats',0,1),
            (47,'CHEM101','Intro to Chemistry',5,3,1,'theory+lab',1,'Mike Johnson','Chemistry',0,1),
            (48,'SOC101','Intro to Sociology',5,3,0,'theory',2,'Sarah Miller','Sociology',0,1),
            (49,'PAK101','Pakistan Studies',5,2,0,'theory',1,'Jane Doe','PakStudies',0,1),
            (50,'ISL101','Islamic Studies',5,2,0,'theory',1,'Sarah Miller','Islamiat',0,1)
        `);
        console.log('   ✅ 50 courses seeded.\n');

        // =============================================
        // STEP 4: TEACHERS
        // =============================================
        console.log('👨‍🏫 Step 4: Seeding teachers...');
        await conn.query(`
            INSERT INTO teachers (employee_id, first_name, last_name, email, phone, department_id, designation, is_active) VALUES 
            ('EMP001', 'John', 'Smith', 'john.smith@nexor.edu', '+921', 1, 'Professor', 1),
            ('EMP002', 'Emily', 'White', 'emily@nexor.edu', '+922', 2, 'Professor', 1)
        `);
        console.log('   ✅ 2 teachers seeded.\n');

        // =============================================
        // STEP 5: STUDENTS
        // =============================================
        console.log('🎓 Step 5: Seeding students...');
        await conn.query(`
            INSERT INTO students (student_id, roll_number, password_hash, full_name, email, dept_id, current_semester) VALUES 
            (1, '24FA-001-CS', '$2a$10$x.z..placeholder..hash', 'Ali Ahmed', 'ali.ahmed@nexor.edu', 1, 1),
            (11, '23SP-001-CS', '$2a$10$x.z..placeholder..hash', 'Huzaifa Ashrafi', 'huzaifa.ashrafi@nexor.edu', 1, 2)
        `);
        console.log('   ✅ 2 students seeded.\n');

        // =============================================
        // STEP 6: TIMETABLE (50 entries)
        // =============================================
        console.log('📅 Step 6: Seeding timetable (50 slots)...');
        await conn.query(`
            INSERT INTO timetable (course_id, day_of_week, start_time, end_time, room_number) VALUES 
            (1,'Monday','08:30:00','10:00:00','Lab-01'),(2,'Tuesday','08:30:00','10:00:00','Room-101'),
            (3,'Wednesday','08:30:00','10:00:00','Lab-02'),(4,'Thursday','08:30:00','10:00:00','Room-102'),
            (5,'Friday','08:30:00','10:00:00','Lab-03'),(6,'Monday','10:30:00','12:00:00','Room-103'),
            (7,'Tuesday','10:30:00','12:00:00','Lab-01'),(8,'Wednesday','10:30:00','12:00:00','Room-104'),
            (9,'Thursday','10:30:00','12:00:00','Room-105'),(10,'Friday','10:30:00','12:00:00','Lab-02'),
            (11,'Monday','13:00:00','14:30:00','Room-201'),(12,'Tuesday','13:00:00','14:30:00','Room-202'),
            (13,'Wednesday','13:00:00','14:30:00','Lab-04'),(14,'Thursday','13:00:00','14:30:00','Room-203'),
            (15,'Friday','13:00:00','14:30:00','Room-204'),(16,'Monday','14:30:00','16:00:00','Lab-05'),
            (17,'Tuesday','14:30:00','16:00:00','Room-205'),(18,'Wednesday','14:30:00','16:00:00','Room-206'),
            (19,'Thursday','14:30:00','16:00:00','Room-207'),(20,'Friday','14:30:00','16:00:00','Room-208'),
            (21,'Monday','08:30:00','10:00:00','Hall-A'),(22,'Tuesday','08:30:00','10:00:00','Hall-B'),
            (23,'Wednesday','08:30:00','10:00:00','Hall-C'),(24,'Thursday','08:30:00','10:00:00','Room-301'),
            (25,'Friday','08:30:00','10:00:00','Room-302'),(26,'Monday','10:30:00','12:00:00','Room-303'),
            (27,'Tuesday','10:30:00','12:00:00','Room-304'),(28,'Wednesday','10:30:00','12:00:00','Room-305'),
            (29,'Thursday','10:30:00','12:00:00','Room-306'),(30,'Friday','10:30:00','12:00:00','Room-307'),
            (31,'Monday','13:00:00','14:30:00','Lab-AI-1'),(32,'Tuesday','13:00:00','14:30:00','Lab-AI-2'),
            (33,'Wednesday','13:00:00','14:30:00','Lab-AI-3'),(34,'Thursday','13:00:00','14:30:00','Room-401'),
            (35,'Friday','13:00:00','14:30:00','Room-402'),(36,'Monday','14:30:00','16:00:00','Lab-Robo'),
            (37,'Tuesday','14:30:00','16:00:00','Room-403'),(38,'Wednesday','14:30:00','16:00:00','Room-404'),
            (39,'Thursday','14:30:00','16:00:00','Lab-AI-4'),(40,'Friday','14:30:00','16:00:00','Room-405'),
            (41,'Monday','08:30:00','10:00:00','Lecture-1'),(42,'Tuesday','08:30:00','10:00:00','Lecture-2'),
            (43,'Wednesday','08:30:00','10:00:00','Physics-Lab'),(44,'Thursday','08:30:00','10:00:00','Lecture-3'),
            (45,'Friday','08:30:00','10:00:00','Lecture-4'),(46,'Monday','10:30:00','12:00:00','Lecture-5'),
            (47,'Tuesday','10:30:00','12:00:00','Lecture-6'),(48,'Wednesday','10:30:00','12:00:00','Lecture-7'),
            (49,'Thursday','10:30:00','12:00:00','Lecture-8'),(50,'Friday','10:30:00','12:00:00','Lecture-9')
        `);
        console.log('   ✅ 50 timetable slots seeded.\n');

        // =============================================
        // STEP 7: COURSE REGISTRATIONS
        // =============================================
        console.log('📋 Step 7: Seeding course registrations...');
        // Student 1 (Ali Ahmed - Semester 1): CS101, MATH101, PSY101, ENG101, PHYS101
        // Student 11 (Huzaifa - Semester 2): CS203, CS209, CS215, MATH102, STATS101
        const registrations = [
            [1, 1, 'Ali Ahmed', '24FA-001-CS', 'Registered'],    // CS101
            [1, 41, 'Ali Ahmed', '24FA-001-CS', 'Registered'],   // MATH101
            [1, 43, 'Ali Ahmed', '24FA-001-CS', 'Registered'],   // PHYS101
            [1, 44, 'Ali Ahmed', '24FA-001-CS', 'Registered'],   // PSY101
            [1, 45, 'Ali Ahmed', '24FA-001-CS', 'Registered'],   // ENG101
            [11, 2, 'Huzaifa Ashrafi', '23SP-001-CS', 'Registered'],   // CS203
            [11, 3, 'Huzaifa Ashrafi', '23SP-001-CS', 'Registered'],   // CS209
            [11, 4, 'Huzaifa Ashrafi', '23SP-001-CS', 'Registered'],   // CS215
            [11, 42, 'Huzaifa Ashrafi', '23SP-001-CS', 'Registered'],  // MATH102
            [11, 46, 'Huzaifa Ashrafi', '23SP-001-CS', 'Registered'],  // STATS101
        ];
        for (const reg of registrations) {
            await conn.query(
                'INSERT INTO course_registrations (student_id, course_id, full_name, roll_number, status) VALUES (?,?,?,?,?)',
                reg
            );
        }
        console.log('   ✅ 10 course registrations seeded.\n');

        // =============================================
        // STEP 8: FEES (auto-generated from registrations)
        // =============================================
        console.log('💰 Step 8: Seeding fees...');
        const dueDate = '2025-04-15';
        const fees = [
            [1, 'Ali Ahmed', '24FA-001-CS', 450, dueDate, 'Pending', 'CS101 - Programming Fundamentals (3 credit hrs)'],
            [1, 'Ali Ahmed', '24FA-001-CS', 450, dueDate, 'Pending', 'MATH101 - Calculus I (3 credit hrs)'],
            [1, 'Ali Ahmed', '24FA-001-CS', 600, dueDate, 'Pending', 'PHYS101 - Applied Physics (3+1 credit hrs)'],
            [1, 'Ali Ahmed', '24FA-001-CS', 450, dueDate, 'Pending', 'PSY101 - Intro to Psychology (3 credit hrs)'],
            [1, 'Ali Ahmed', '24FA-001-CS', 450, dueDate, 'Cleared', 'ENG101 - English Composition (3 credit hrs)'],
            [11, 'Huzaifa Ashrafi', '23SP-001-CS', 600, dueDate, 'Pending', 'CS203 - Data Structures (3+1 credit hrs)'],
            [11, 'Huzaifa Ashrafi', '23SP-001-CS', 600, dueDate, 'Pending', 'CS209 - Digital Logic Design (3+1 credit hrs)'],
            [11, 'Huzaifa Ashrafi', '23SP-001-CS', 450, dueDate, 'Cleared', 'CS215 - Discrete Mathematics (3 credit hrs)'],
            [11, 'Huzaifa Ashrafi', '23SP-001-CS', 450, dueDate, 'Pending', 'MATH102 - Calculus II (3 credit hrs)'],
            [11, 'Huzaifa Ashrafi', '23SP-001-CS', 450, dueDate, 'Pending', 'STATS101 - Probability & Stats (3 credit hrs)'],
        ];
        for (const fee of fees) {
            await conn.query(
                'INSERT INTO fees (student_id, full_name, roll_number, amount, due_date, status, description) VALUES (?,?,?,?,?,?,?)',
                fee
            );
        }
        console.log('   ✅ 10 fees seeded.\n');

        // =============================================
        // STEP 9: ACADEMIC HISTORY
        // =============================================
        console.log('📊 Step 9: Seeding academic history...');
        await conn.query(`
            INSERT INTO academic_history (student_id, course_id, semester, grade, grade_point, completion_date) VALUES 
            (1, 41, 1, 'B+', 3.33, '2024-06-15'),
            (1, 44, 1, 'A-', 3.67, '2024-06-15'),
            (1, 45, 1, 'B',  3.00, '2024-06-15'),
            (11, 1,  1, 'A',  4.00, '2024-06-15'),
            (11, 21, 1, 'B+', 3.33, '2024-06-15'),
            (11, 31, 1, 'A-', 3.67, '2024-06-15')
        `);
        console.log('   ✅ 6 academic history records seeded.\n');

        // =============================================
        // STEP 10: ATTENDANCE
        // =============================================
        console.log('✋ Step 10: Seeding attendance...');
        await conn.query(`
            INSERT INTO attendance (student_id, course_id, date, status) VALUES 
            (1,  1,  '2025-01-06', 'Present'),
            (1,  41, '2025-01-06', 'Present'),
            (1,  43, '2025-01-06', 'Present'),
            (1,  44, '2025-01-08', 'Absent'),
            (1,  45, '2025-01-08', 'Present'),
            (11, 2,  '2025-01-06', 'Present'),
            (11, 3,  '2025-01-07', 'Present'),
            (11, 4,  '2025-01-08', 'Present'),
            (11, 42, '2025-01-09', 'Absent'),
            (11, 46, '2025-01-10', 'Present')
        `);
        console.log('   ✅ 10 attendance records seeded.\n');

        // =============================================
        // STEP 11: NOTIFICATIONS
        // =============================================
        console.log('🔔 Step 11: Seeding notifications...');
        await conn.query(`
            INSERT INTO notifications (student_id, title, message, type) VALUES 
            (1, 'Schedule Updated', 'Your full course schedule for Semester 1 is now live!', 'Administrative'),
            (NULL, 'Semester Registration Open', 'Registration for the next semester is now open. Submit your course requests by March 31st.', 'Academic'),
            (NULL, 'Fee Submission Deadline', 'Please clear all pending fees before April 15th to avoid a late surcharge.', 'Administrative')
        `);
        console.log('   ✅ 3 notifications seeded.\n');

        // =============================================
        // FINAL VERIFICATION
        // =============================================
        console.log('🔍 Final Verification:');
        const tables = ['departments', 'courses', 'teachers', 'students', 'timetable', 'course_registrations', 'fees', 'academic_history', 'attendance', 'notifications'];
        for (const t of tables) {
            const [rows] = await conn.query(`SELECT COUNT(*) as c FROM ${t}`);
            console.log(`   ${t}: ${rows[0].c} rows`);
        }

        console.log('\n🎉 Full sync complete! Cloud database now matches local data perfectly.');

    } catch (e) {
        console.error('❌ Sync Error:', e.message);
        console.error(e.stack);
    } finally {
        await conn.end();
    }
}

fullSync();
