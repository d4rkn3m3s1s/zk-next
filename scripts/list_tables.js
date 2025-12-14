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

console.log("Listing tables...");

Firebird.attach(options, (err, db) => {
    if (err) {
        console.error("CONNECTION ERROR:", err);
        process.exit(1);
    }

    // Query to list tables in Firebird
    const query = `
        SELECT RDB$RELATION_NAME 
        FROM RDB$RELATIONS 
        WHERE RDB$SYSTEM_FLAG = 0 
        AND RDB$VIEW_BLR IS NULL
        ORDER BY RDB$RELATION_NAME
    `;

    db.query(query, (err, result) => {
        db.detach();
        if (err) {
            console.error("QUERY ERROR:", err);
            process.exit(1);
        } else {
            console.log("Found " + result.length + " tables:");
            result.forEach(row => {
                // Firebird results might be buffers or objects depending on driver config
                const name = row.RDB$RELATION_NAME.toString().trim();
                console.log("- " + name);
            });
            process.exit(0);
        }
    });
});
