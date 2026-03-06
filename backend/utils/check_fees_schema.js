const db = require('../config/db');

async function showFees() {
    try {
        console.log('--- CREATE TABLE fees ---');
        const [f] = await db.query('SHOW CREATE TABLE fees');
        console.log(f[0]['Create Table']);

        console.log('\n--- Sample Data from fees ---');
        const [samples] = await db.query('SELECT * FROM fees LIMIT 5');
        console.table(samples);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

showFees();
