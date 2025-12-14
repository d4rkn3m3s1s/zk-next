const Firebird = require('node-firebird');

const options = {
    host: 'localhost',
    port: 3055,
    database: 'C:\\AKINSOFT\\Wolvox8\\Database_FB\\SIRKET.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false,
    role: undefined
};

console.log("Testing connection to Firebird on " + options.host + ":" + options.port + "...");
console.log("Database Path:", options.database);

// Add 5 second timeout
setTimeout(() => {
    console.error("TIMEOUT: Connection took longer than 5 seconds.");
    console.error("POSSIBLE CAUSES:");
    console.error("1. Windows Firewall is blocking Port 3055.");
    console.error("2. 'Max User' license limit reached (Close Wolvox ERP/Control Panel).");
    console.error("3. Firebird Service needs restart.");
    process.exit(1);
}, 5000);

Firebird.attach(options, (err, db) => {
    if (err) {
        console.error("CONNECTION FAILED:");
        console.error(err);
        return;
    }

    console.log("CONNECTION SUCCESSFUL!");

    db.query('SELECT count(*) as CNT FROM STOK', (err, result) => {
        db.detach();
        if (err) {
            console.error("QUERY FAILED:", err);
        } else {
            console.log("Query Result (Row Count):", result);
        }
    });
});
