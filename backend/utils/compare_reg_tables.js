const db = require('../config/db');

async function compareTables() {
    try {
        const [reg] = await db.query('SELECT COUNT(*) as count FROM course_registration');
        const [regs] = await db.query('SELECT COUNT(*) as count FROM course_registrations');

        console.log(`course_registration (singular): ${reg[0].count}`);
        console.log(`course_registrations (plural): ${regs[0].count}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

compareTables();
