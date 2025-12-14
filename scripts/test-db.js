const Firebird = require('node-firebird');

const options = {
    host: 'localhost',
    port: 3050,
    database: 'C:\\AKINSOFT\\Wolvox8\\Database_FB\\SIRKET.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false,
    role: undefined,
    pageSize: 4096,
    retryConnectionInterval: 1000
};

console.log("Starting test-db.js");
console.log("Options:", JSON.stringify(options, null, 2));

process.on('uncaughtException', (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
    process.exit(1);
});

try {
    Firebird.attach(options, (err, db) => {
        if (err) {
            console.error("CONNECTION ERROR CALLBACK:", err);
            // Check specifically for common errors
            if (err.code === 'ECONNREFUSED') {
                console.error("Error: Connection refused. Is Firebird running on port 3055?");
            }
            process.exit(1);
        }
        console.log("Connection successful!");

        db.query('SELECT FIRST 1 * FROM RDB$RELATIONS', (err, result) => {
            db.detach();
            if (err) {
                console.error("QUERY ERROR:", err);
                process.exit(1);
            } else {
                console.log("Query successful, found " + result.length + " rows.");
                process.exit(0);
            }
        });
    });
} catch (e) {
    console.error("SYNC ERROR DURING ATTACH:", e);
}

// Keep alive for a bit
setTimeout(() => {
    console.error("TIMEOUT REACHED (10s)");
    process.exit(1);
}, 10000);
