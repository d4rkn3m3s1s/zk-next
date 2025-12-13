const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'dev.db');
const db = new Database(dbPath);

async function main() {
    console.log('Verifying login...');
    console.log('DB Path:', dbPath);

    const row = db.prepare('SELECT * FROM User WHERE email = ?').get('admin@zkiletisim.com');

    if (!row) {
        console.error('User not found!');
        process.exit(1);
    }

    console.log('User found:', row.email, row.role);
    console.log('Stored Hash:', row.password);

    const match = await bcrypt.compare('admin123', row.password);
    
    if (match) {
        console.log('✅ Password "admin123" matches!');
    } else {
        console.error('❌ Password mismatch!');
    }
}

main();
