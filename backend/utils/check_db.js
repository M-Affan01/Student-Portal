const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const check = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("--- Checking Students ---");
        const [students] = await connection.query('SELECT student_id, roll_number, full_name FROM students');
        console.table(students);

        console.log("\n--- Checking Fees ---");
        const [fees] = await connection.query('SELECT fee_id, student_id, amount, status, payment_date FROM fees');
        fees.forEach(f => {
            console.log(`FeeID: ${f.fee_id} | StudID: ${f.student_id} | Status: ${f.status} | Date: ${f.payment_date}`);
        });

        await connection.end();
    } catch (err) {
        console.error(err);
    }
};

check();
