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

console.log("Checking for STOK table in new DB...");

Firebird.attach(options, (err, db) => {
    if (err) {
        console.error("CONNECTION ERROR:", err);
        process.exit(1);
    }

    // Query to check specifically for STOK
    const query = `
        SELECT count(*) as CNT
        FROM RDB$RELATIONS 
        WHERE RDB$RELATION_NAME = 'STOK'
    `;

    db.query(query, (err, result) => {
        db.detach();
        if (err) {
            console.error("QUERY ERROR:", err);
            process.exit(1);
        } else {
            console.log("Query success. Result:", result);
            if (result[0] && (result[0].CNT > 0 || result[0].cnt > 0)) {
                console.log("STOK TABLE FOUND!");
            } else {
                console.log("STOK TABLE NOT FOUND.");
            }
            process.exit(0);
        }
    });
});
