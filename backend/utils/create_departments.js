const db = require('../config/db');

async function createDepartments() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS departments (
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
            )
        `);
        console.log('Departments table created or already exists.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createDepartments();
