const db = require('../config/db');

async function checkOrphanFees() {
    try {
        console.log('Checking for orphan fees (not in students table)...');
        const [orphans] = await db.query(`
            SELECT f.* FROM fees f
            LEFT JOIN students s ON f.student_id = s.student_id
            WHERE s.student_id IS NULL
        `);
        console.log(`Found ${orphans.length} orphan fees.`);
        if (orphans.length > 0) console.table(orphans);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOrphanFees();
