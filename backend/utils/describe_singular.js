const db = require('../config/db');

async function describeSingular() {
    try {
        console.log('--- course_registration (singular) ---');
        const [regCols] = await db.query('DESCRIBE course_registration');
        console.log(JSON.stringify(regCols, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

describeSingular();
