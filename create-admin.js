const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'dev.db');
const db = new Database(dbPath);

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const stmt = db.prepare(`
            INSERT INTO User (username, email, password, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
        `);
        
        try {
            stmt.run('admin', 'admin@zkiletisim.com', hashedPassword, 'admin');
            console.log('Admin user created successfully.');
        } catch (err) {
            if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.message.includes('UNIQUE constraint')) {
                console.log('Admin user already exists.');
                // Update password just in case
                const update = db.prepare(`UPDATE User SET password = ? WHERE email = ?`);
                update.run(hashedPassword, 'admin@zkiletisim.com');
                console.log('Admin password updated.');
            } else {
                throw err;
            }
        }
    } catch (err) {
        console.error('Error creating admin:', err);
    }
}

main();
