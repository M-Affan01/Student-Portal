const db = require('../config/db');
const fs = require('fs');

async function dumpFees() {
    try {
        const [rows] = await db.query('SELECT * FROM fees');
        fs.writeFileSync('fees_dump.txt', JSON.stringify(rows, null, 2));
        console.log('Fees dumped to fees_dump.txt');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dumpFees();
