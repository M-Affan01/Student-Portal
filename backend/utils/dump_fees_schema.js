const db = require('../config/db');
const fs = require('fs');

async function dumpFeesSchema() {
    try {
        const [f] = await db.query('SHOW CREATE TABLE fees');
        fs.writeFileSync('fees_schema_snapshot.txt', f[0]['Create Table']);
        console.log('Fees schema written to fees_schema_snapshot.txt');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dumpFeesSchema();
