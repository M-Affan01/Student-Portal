const db = require('../config/db');
const fs = require('fs');

async function showDept() {
    try {
        const [d] = await db.query('SHOW CREATE TABLE departments');
        fs.writeFileSync('dept_schema.txt', d[0]['Create Table']);
        console.log('Dept schema written to dept_schema.txt');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

showDept();
