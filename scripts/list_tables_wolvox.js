const Firebird = require('node-firebird');

const options = {
    host: 'localhost',
    port: 3050,
    database: 'C:\\AKINSOFT\\Wolvox8\\Database_FB\\01\\2022\\WOLVOX.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    lowercase_keys: false,
    role: undefined,
    pageSize: 4096,
    retryConnectionInterval: 1000
};

console.log("Listing tables in WOLVOX.FDB...");

Firebird.attach(options, (err, db) => {
    if (err) {
        console.error("CONNECTION ERROR:", err);
        process.exit(1);
    }

    // Query to list tables
        SELECT RDB$RELATION_NAME 
        FROM RDB$RELATIONS 
        WHERE RDB$SYSTEM_FLAG = 0 
        AND RDB$VIEW_BLR IS NULL
        AND RDB$RELATION_NAME LIKE 'CARI%'
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
                const name = row.RDB$RELATION_NAME.toString().trim();
                console.log("- " + name);
            });
            process.exit(0);
        }
    });
});
