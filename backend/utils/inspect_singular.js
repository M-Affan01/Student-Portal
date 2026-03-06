const db = require('../config/db');

async function inspectSingular() {
    try {
        console.log('--- course_registration (singular) rows ---');
        const [rows] = await db.query('SELECT * FROM course_registration');
        console.log(`Count: ${rows.length}`);
        if (rows.length > 0) console.table(rows);
        process.exit(0);
    } catch (err) {
        // If it doesn't exist or error
        console.error(err.message);
        process.exit(1);
    }
}

inspectSingular();
