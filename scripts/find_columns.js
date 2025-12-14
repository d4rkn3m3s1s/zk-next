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

console.log("Searching for price/stock columns...");

Firebird.attach(options, (err, db) => {
    if (err) {
        console.error("CONNECTION ERROR:", err);
        process.exit(1);
    }

    // Query to find tables containing specific columns
    const query = `
        SELECT RDB$RELATION_NAME, RDB$FIELD_NAME
        FROM RDB$RELATION_FIELDS
        WHERE RDB$FIELD_NAME IN ('SATIS_FIYAT1', 'BAKIYE', 'MIKTAR')
        ORDER BY RDB$RELATION_NAME, RDB$FIELD_NAME
    `;

    db.query(query, (err, result) => {
        db.detach();
        if (err) {
            console.error("QUERY ERROR:", err);
            process.exit(1);
        } else {
            console.log("Found matches:");
            result.forEach(row => {
                console.log(`${row.RDB$RELATION_NAME.toString().trim()} -> ${row.RDB$FIELD_NAME.toString().trim()}`);
            });
            process.exit(0);
        }
    });
});
