-- Database: nexor_university
DROP DATABASE IF EXISTS nexor_university;
CREATE DATABASE nexor_university;
USE nexor_university;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Departments
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    head_of_department VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    building VARCHAR(50),
    meeting_day VARCHAR(20),
    meeting_time VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Teachers
CREATE TABLE teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id INT,
    designation VARCHAR(50),
    max_weekly_hours INT DEFAULT 20,
    current_weekly_hours INT DEFAULT 0,
    joining_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- 3. Students
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    dept_id INT,
    batch_year INT,
    current_semester INT DEFAULT 1,
    cgpa DECIMAL(3, 2) DEFAULT 0.00,
    total_credits INT DEFAULT 0,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(department_id)
);

-- 4. Courses
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    department_id INT,
    credit_hours INT NOT NULL CHECK (credit_hours > 0),
    lab_credit_hours INT DEFAULT 0,
    course_type VARCHAR(50) DEFAULT 'Core',
    semester_number INT,
    instructor_name VARCHAR(100),
    max_seats INT DEFAULT 60,
    description TEXT,
    is_elective BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- 5. Course Registrations
CREATE TABLE course_registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    semester INT,
    status ENUM('Registered', 'Waitlisted', 'Dropped') DEFAULT 'Registered',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(100),
    roll_number VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE(student_id, course_id)
);

-- 6. Academic History
CREATE TABLE academic_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    semester INT,
    grade VARCHAR(2),
    grade_point DECIMAL(3, 2),
    completion_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- 7. Timetable
CREATE TABLE timetable (
    timetable_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    start_time TIME,
    end_time TIME,
    room_number VARCHAR(20),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- 8. Fees
CREATE TABLE fees (
    fee_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    full_name VARCHAR(100),
    roll_number VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    status ENUM('Paid', 'Pending', 'Overdue', 'Cleared') DEFAULT 'Pending',
    description VARCHAR(255),
    payment_date DATE,
    transaction_id VARCHAR(50),
    card_ending VARCHAR(4),
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- 9. Payments
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    student_name VARCHAR(100),
    amount DECIMAL(10, 2),
    transaction_id VARCHAR(50),
    payment_date DATE,
    card_ending VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- 10. Notifications
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    title VARCHAR(100),
    message TEXT,
    type ENUM('Academic', 'Administrative', 'Emergency') DEFAULT 'Academic',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- 11. Student Courses
CREATE TABLE student_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    roll_number VARCHAR(20),
    full_name VARCHAR(100),
    course_id INT,
    course_name VARCHAR(100),
    student_semester INT,
    course_semester INT,
    academic_year VARCHAR(10),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 12. Teacher Courses
CREATE TABLE teacher_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    teacher_name VARCHAR(100),
    course_id INT,
    course_name VARCHAR(100),
    semester INT,
    academic_year VARCHAR(10),
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 13. Attendance
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    date DATE,
    status ENUM('Present', 'Absent', 'Late', 'Excused') DEFAULT 'Present',
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

SET FOREIGN_KEY_CHECKS = 1;