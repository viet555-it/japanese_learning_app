import db from '../src/config/db.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function getTables() {
    try {
        const [tables] = await db.query('SHOW TABLES');
        console.log(tables.map(t => Object.values(t)[0]));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
getTables();
