const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const run = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("--- BEFORE UPDATE ---");
        const [before] = await connection.query('SELECT fee_id, status FROM fees WHERE student_id = 1');
        console.log(JSON.stringify(before));

        console.log("\n--- EXECUTING UPDATE ---");
        const today = new Date().toISOString().slice(0, 10);
        const [result] = await connection.query(
            'UPDATE fees SET status = ?, payment_date = ? WHERE student_id = ?',
            ['Paid', today, 1]
        );
        console.log("Affected Rows:", result.affectedRows);

        console.log("\n--- AFTER UPDATE ---");
        const [after] = await connection.query('SELECT fee_id, status, payment_date FROM fees WHERE student_id = 1');
        console.log(JSON.stringify(after));

        await connection.end();
    } catch (err) {
        console.error(err);
    }
};

run();
